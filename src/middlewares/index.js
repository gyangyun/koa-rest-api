import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
// import path from 'path'
// import server from 'koa-static'
import auth from '../controllers/auth'
import session from 'koa-generic-session'
import config from 'config'
import redisStore from 'koa-redis'
import convert from 'koa-convert'
import restify from './restify'

const keys = config.get('Customer.keys')

export default function (app) {
  app.use(logger())
  app.use(bodyParser())
  app.use(auth())
  app.keys = keys
  app.use(convert(session({
    store: redisStore()
  })))
  app.use(restify('/api'))
  // app.use(server(path.join(__dirname, '..', 'public', 'assets')))
}
