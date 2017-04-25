import Router from 'koa-router'
import { token } from '../../controllers/auth/oauth2'

const router = Router({
  prefix: 'auth'
})

router.post('/token', token())
// router.post('/token', async (ctx, next) => { ctx.body = ctx.request.body })

// for require auto in index.js
export default router
