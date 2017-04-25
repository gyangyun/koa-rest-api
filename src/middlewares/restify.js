export default (pathPrefix = '/api') => {
  return async (ctx, next) => {
    if (ctx.request.path.startsWith(pathPrefix)) {
      // 绑定异常类APIError
      ctx.APIError = function (code, message) {
        this.code = code || 'internal:unknown_error'
        this.message = String(message) || ''
      }
      // 绑定rest()方法
      ctx.rest = (data) => {
        ctx.response.type = 'application/json'
        ctx.response.body = data
      }
      try {
        await next()
      } catch (e) {
        // 捕捉返回的错误
        ctx.response.status = 400
        ctx.response.type = 'application/json'
        ctx.response.body = {
          code: e.code || 'internal:unknown_error',
          message: e.message || ''
        }
      }
    } else {
      await next()
    }
  }
}
