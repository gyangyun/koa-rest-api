import models from '../../models'

export default (router) => {
  router.patch('/normalusers', async (ctx, next) => {
    try {
      const user = await models.User.findById(ctx.state.user.id)
      const data = ctx.request.body.password ? { email: ctx.request.body.email || user.email, password: ctx.request.body.password } : { email: ctx.request.body.email || user.email }
      await user.update(data)
      ctx.rest({
        code: 'success',
        message: 'Updated a normaluser successfully'
      })
    } catch (e) {
      /* handle error */
      throw new ctx.APIError('normalusers:update_error', e)
    }
  })
}
