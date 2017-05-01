import models from '../../models'
import logger from '../../utils/logger'

const log = logger(module)

export default (router) => {
  router.patch('/normalusers', async (ctx, next) => {
    try {
      const user = await models.User.findById(ctx.state.user.id)
      const data = {
        name: ctx.request.body.username || user.name,
        email: ctx.request.body.email || user.email,
        password: ctx.request.body.password || user.password
      }
      await user.update(data)
      ctx.rest({
        code: 'success',
        message: 'Updated a normaluser successfully'
      })
    } catch (e) {
      log.error(e)
      throw new ctx.APIError('normalusers:update_error', e)
    }
  })
}
