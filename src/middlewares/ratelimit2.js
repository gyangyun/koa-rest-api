/**
 * Module dependencies.
 */

const debug = require('debug')('ratelimit2')
const Limiter = require('ratelimiter')
const ms = require('ms')
const unless = require('koa-unless')

/**
 * Expose `ratelimit()`.
 */

module.exports = ratelimit

/**
 * Initialize ratelimit middleware with the given `opts`:
 *
 * - `duration` limit duration in milliseconds [1 hour]
 * - `max` max requests per `id` [2500]
 * - `db` database connection
 * - `id` id to compare requests [ip]
 * - `headers` custom header names
 *  - `remaining` remaining number of requests ['X-RateLimit-Remaining']
 *  - `reset` reset timestamp ['X-RateLimit-Reset']
 *  - `total` total number of requests ['X-RateLimit-Limit']
 *
 * @param {Object} opts
 * @return {Function}
 * @api public
 */

function ratelimit (opts = {}) {
  const {
    remaining = 'X-RateLimit-Remaining',
    reset = 'X-RateLimit-Reset',
    total = 'X-RateLimit-Limit'
  } = opts.headers || {}

  async function ratelimit (ctx, next) {
    const id = opts.id ? opts.id(ctx) : ctx.ip

    if (id === false) return await next()

    // max在Limiter里已经有一个默认值2500了
    const max = opts.max ? opts.max(ctx) : 2500

    // duration在Limiter里已经有一个默认值60 * 60 * 1000了
    const duration = opts.duration ? opts.duration(ctx) : 60 * 60 * 1000

    // initialize limiter
    const limiter = new Limiter(Object.assign({}, opts, { id, max, duration }))

    // check limit
    const limit = await thenify(limiter.get.bind(limiter))

    // check if current call is legit
    const calls = limit.remaining > 0 ? limit.remaining - 1 : 0

    // header fields
    const headers = {
      [remaining]: calls,
      [reset]: limit.reset,
      [total]: limit.total
    }

    ctx.set(headers)

    debug('remaining %s/%s %s', remaining, limit.total, id)
    if (limit.remaining) return await next()

    const delta = (limit.reset * 1000) - Date.now() | 0
    const after = limit.reset - (Date.now() / 1000) | 0
    ctx.set('Retry-After', after)

    ctx.status = 429
    ctx.body = opts.errorMessage || `Rate limit exceeded, retry in ${ms(delta, { long: true })}.`

    if (opts.throw) {
      ctx.throw(ctx.status, ctx.body, { headers: headers })
    }
  }

  // 绑定unless插件到unless属性上，可以用来针对某种情况跳过本插件
  ratelimit.unless = unless

  return ratelimit
}

/**
 * Helper function to convert a callback to a Promise.
 */

async function thenify (fn) {
  return await new Promise(function (resolve, reject) {
    function callback (err, res) {
      if (err) return reject(err)
      return resolve(res)
    }

    fn(callback)
  })
}
