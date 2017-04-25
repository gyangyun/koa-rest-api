import Router from 'koa-router'
import addRoutes from '../utils/routes'

const router = Router({
  prefix: '/'
})
addRoutes(router, __dirname, __filename)

export default router
