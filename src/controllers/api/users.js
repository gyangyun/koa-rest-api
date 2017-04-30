import models from '../../models'
import logger from '../../utils/logger'

const log = logger(module)
const usersController = {}

usersController.store = async (ctx, next) => {
  try {
    const user = await models.User.create({
      name: ctx.request.body.userName,
      email: ctx.request.body.email,
      password: ctx.request.body.password
    })
    const roles = await models.Role.findAll({
      where: {
        id: ctx.request.body.ids
      }
    })
    await user.addRoles(roles)
    ctx.rest({
      code: 'success',
      message: 'Created a user successfully'
    })
  } catch (e) {
    log.error(e)
    throw new ctx.APIError('users:add_error', e)
  }
}

usersController.update = async (ctx, next) => {
  try {
    const user = await models.User.findById(ctx.params.id)
    const roles = await models.Role.findAll({
      where: {
        id: ctx.request.body.ids
      }
    })
    await user.setRoles(roles)
    const data = {
      name: ctx.request.body.userName || user.name,
      email: ctx.request.body.email || user.email,
      password: ctx.request.body.password || user.password
    }
    await user.update(data)
    ctx.rest({
      code: 'success',
      message: 'Updated a user successfully'
    })
  } catch (e) {
    log.error(e)
    throw new ctx.APIError('users:update_error', e)
  }
}

usersController.destroy = async (ctx, next) => {
  try {
    const user = await models.User.findById(ctx.params.id)
    await user.destroy()
    ctx.rest({
      code: 'success',
      message: 'Destroyed a user successfully'
    })
  } catch (e) {
    log.error(e)
    throw new ctx.APIError('users:destroy_error', e)
  }
}

usersController.bulkDestroy = async (ctx, next) => {
  try {
    const affectedRows = await models.User.destroy({
      where: {id: ctx.request.body.ids}
    })
    ctx.rest({
      code: 'success',
      message: `Destroyed ${affectedRows} users successfully`
    })
  } catch (e) {
    log.error(e)
    throw new ctx.APIError('users:destroy_error', e)
  }
}

usersController.list = async (ctx, next) => {
  try {
    const users = await models.User.findAll({
      attributes: ['id', 'name', 'email', 'created_at', 'updated_at'],
      include: [
        {
          model: models.Role,
          include: [
            {
              model: models.Permission
            }
          ]
        }
      ]
    })
    ctx.rest({
      code: 'success',
      message: 'List users successfully',
      data: users
    })
  } catch (e) {
    log.error(e)
    throw new ctx.APIError('users:list_error', e)
  }
}

usersController.show = async (ctx, next) => {
  try {
    const user = await models.User.findById(ctx.params.id, {
      attributes: ['id', 'name', 'email', 'created_at', 'updated_at'],
      include: [
        {
          model: models.Role,
          include: [
            {
              model: models.Permission
            }
          ]
        }
      ]
    })
    if (user) {
      ctx.rest({
        code: 'success',
        message: 'Showed a user successfully',
        data: user
      })
    } else {
      throw new ctx.APIError('users:show_error', 'No such record')
    }
  } catch (e) {
    log.error(e)
    if (e instanceof ctx.APIError) {
      throw e
    } else {
      throw new ctx.APIError('users:show_error', e)
    }
  }
}

export default usersController
