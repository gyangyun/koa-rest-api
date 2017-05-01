import models from '../../models'
import logger from '../../utils/logger'

const log = logger(module)
const rolesController = {}

rolesController.store = async (ctx, next) => {
  try {
    const role = await models.Role.create({
      name: ctx.request.body.roleName,
      display_name: ctx.request.body.roleDisplayName,
      description: ctx.request.body.roleDescription
    })
    const permissions = await models.Permission.findAll({
      where: {
        id: ctx.request.body.permissionIds
      }
    })
    await role.addPermissions(permissions)
    ctx.rest({
      code: 'success',
      message: 'Created a role successfully'
    })
  } catch (e) {
    log.error(e)
    throw new ctx.APIError('roles:add_error', e)
  }
}

rolesController.update = async (ctx, next) => {
  try {
    const role = await models.Role.findById(ctx.params.id)
    const permissions = await models.Permission.findAll({
      where: {
        id: ctx.request.body.permissionIds
      }
    })
    await role.setPermissions(permissions)
    const data = {
      name: ctx.request.body.roleName || role.name,
      display_name: ctx.request.body.roleDisplayName || role.display_name,
      description: ctx.request.body.roleDescription || role.description
    }
    await role.update(data)
    ctx.rest({
      code: 'success',
      message: 'Updated a role successfully'
    })
  } catch (e) {
    log.error(e)
    throw new ctx.APIError('roles:update_error', e)
  }
}

rolesController.destroy = async (ctx, next) => {
  try {
    const role = await models.Role.findById(ctx.params.id)
    await role.destroy()
    ctx.rest({
      code: 'success',
      message: 'Destroyed a role successfully'
    })
  } catch (e) {
    log.error(e)
    throw new ctx.APIError('roles:destroy_error', e)
  }
}

rolesController.bulkDestroy = async (ctx, next) => {
  try {
    const affectedRows = await models.Role.destroy({
      where: {id: ctx.request.body.roleIds}
    })
    ctx.rest({
      code: 'success',
      message: `Destroyed ${affectedRows} roles successfully`
    })
  } catch (e) {
    log.error(e)
    throw new ctx.APIError('roles:destroy_error', e)
  }
}

rolesController.list = async (ctx, next) => {
  try {
    const roles = await models.Role.findAll({
      include: [
        {
          model: models.Permission
        }
      ]
    })
    ctx.rest({
      code: 'success',
      message: 'List roles successfully',
      data: roles
    })
  } catch (e) {
    log.error(e)
    throw new ctx.APIError('roles:list_error', e)
  }
}

rolesController.show = async (ctx, next) => {
  try {
    const role = await models.Role.findById(ctx.params.id, {
      include: [
        {
          model: models.Permission
        }
      ]
    })
    if (role) {
      ctx.rest({
        code: 'success',
        message: 'Showed a role successfully',
        data: role
      })
    } else {
      throw new ctx.APIError('roles:show_error', 'No such record')
    }
  } catch (e) {
    log.error(e)
    if (e instanceof ctx.APIError) {
      throw e
    } else {
      throw new ctx.APIError('roles:show_error', e)
    }
  }
}

export default rolesController
