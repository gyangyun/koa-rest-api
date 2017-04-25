import models from '../../models'
import bcrypt from 'bcryptjs'
import logger from '../../utils/logger'

const log = logger(module)
const usersController = {}

usersController.store = async (ctx, next) => {
  try {
    let user = await models.User.create({
      name: ctx.request.body.userName,
      email: ctx.request.body.email,
      password: bcrypt.hashSync(ctx.request.body.password, 10)
    })
    let roles = await models.Role.findAll({
      where: {
        name: ctx.request.body.roleNames
      }
    })
    await user.addRoles(roles)
    log.info('created: ' + JSON.stringify(user))
    ctx.rest({
      code: 'success',
      message: 'Created a user successfully'
    })
  } catch (err) {
    throw new ctx.APIError('users:add_error', err)
  }
}

usersController.update = async (ctx, next) => {
  try {
    let user = await models.User.findById(ctx.params.id)
    // let roles = await user.getRoles()
    let roles = await models.Role.findAll({
      where: {
        name: ctx.request.body.roleNames
      }
    })
    await user.setRoles(roles)
    await user.update({
      email: ctx.request.body.email || user.email,
      password: bcrypt.hashSync(ctx.request.body.password, bcrypt.genSaltSync(10)) || user.password
    })
    log.info('updated: ' + JSON.stringify(user))
    ctx.rest({
      code: 'success',
      message: 'Updated a user successfully'
    })
  } catch (err) {
    throw new ctx.APIError('users:update_error', err)
  }
}

usersController.destroy = async (ctx, next) => {
  try {
    let user = await models.User.findById(ctx.params.id)
    await user.destroy()
    log.info('destroyed: ' + JSON.stringify(user))
    ctx.rest({
      code: 'success',
      message: 'Destroyed a user successfully'
    })
  } catch (err) {
    throw new ctx.APIError('users:destroy_error', err)
  }
}

usersController.bulkDestroy = async (ctx, next) => {
  try {
    let affectedRows = await models.User.destroy({
      'where': {'id': ctx.request.body.ids}
    })
    log.info(`batchDestroied: ${affectedRows} records`)
    ctx.rest({
      code: 'success',
      message: `Destroyed ${affectedRows} users successfully`
    })
  } catch (err) {
    throw new ctx.APIError('users:destroy_error', err)
  }
}

usersController.list = async (ctx, next) => {
  try {
    let users = await models.User.findAll({
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
    log.info('list: ' + JSON.stringify(users))
    ctx.rest({
      code: 'success',
      message: 'Index users successfully',
      data: users
    })
  } catch (err) {
    throw new ctx.APIError('users:index_error', err)
  }
}

usersController.show = async (ctx, next) => {
  try {
    let user = await models.User.findById(ctx.params.id, {
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
    log.info('showed: ' + JSON.stringify(user))
    ctx.rest({
      code: 'success',
      message: 'Showed a user successfully',
      data: user
    })
  } catch (err) {
    throw new ctx.APIError('users:show_error', err)
  }
}

export default usersController
