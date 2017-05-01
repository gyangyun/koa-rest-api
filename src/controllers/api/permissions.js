import models from '../../models'
import logger from '../../utils/logger'

const log = logger(module)
const pmssController = {}

pmssController.store = async (ctx, next) => {
  try {
    await models.Permission.create({
      name: ctx.request.body.permissionName,
      display_name: ctx.request.body.permissionDisplayName,
      description: ctx.request.body.permissionDescription
    })
    ctx.rest({
      code: 'success',
      message: 'Created a permission successfully'
    })
  } catch (e) {
    log.error(e)
    throw new ctx.APIError('permissions:add_error', e)
  }
}

pmssController.update = async (ctx, next) => {
  try {
    const permission = await models.Permission.findById(ctx.params.id)
    const data = {
      name: ctx.request.body.permissionName || permission.name,
      display_name: ctx.request.body.permissionDisplayName || permission.display_name,
      description: ctx.request.body.permissionDescription || permission.description
    }
    await permission.update(data)
    ctx.rest({
      code: 'success',
      message: 'Updated a permission successfully'
    })
  } catch (e) {
    log.error(e)
    throw new ctx.APIError('permissions:update_error', e)
  }
}

pmssController.destroy = async (ctx, next) => {
  try {
    const permission = await models.Permission.findById(ctx.params.id)
    await permission.destroy()
    ctx.rest({
      code: 'success',
      message: 'Destroyed a permission successfully'
    })
  } catch (e) {
    log.error(e)
    throw new ctx.APIError('permissions:destroy_error', e)
  }
}

pmssController.bulkDestroy = async (ctx, next) => {
  try {
    const affectedRows = await models.Permission.destroy({
      where: {id: ctx.request.body.permissionIds}
    })
    ctx.rest({
      code: 'success',
      message: `Destroyed ${affectedRows} permissions successfully`
    })
  } catch (e) {
    log.error(e)
    throw new ctx.APIError('permissions:destroy_error', e)
  }
}

pmssController.list = async (ctx, next) => {
  try {
    const permissions = await models.Permission.findAll()
    ctx.rest({
      code: 'success',
      message: 'List permissions successfully',
      data: permissions
    })
  } catch (e) {
    log.error(e)
    throw new ctx.APIError('permissions:list_error', e)
  }
}

pmssController.show = async (ctx, next) => {
  try {
    const permission = await models.Permission.findById(ctx.params.id)
    if (permission) {
      ctx.rest({
        code: 'success',
        message: 'Showed a permission successfully',
        data: permission
      })
    } else {
      throw new ctx.APIError('permissions:show_error', 'No such record')
    }
  } catch (e) {
    log.error(e)
    if (e instanceof ctx.APIError) {
      throw e
    } else {
      throw new ctx.APIError('permissions:show_error', e)
    }
  }
}

export default pmssController
