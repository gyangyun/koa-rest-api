import models from '../../models'
const rolesController = {}

rolesController.store = async (ctx, next) => {
  try {
    let [role] = await models.Role.findCreateFind({where: {name: ctx.request.body.roleName},
      defaults: {
        display_name: ctx.request.body.roleDisplayName,
        description: ctx.request.body.roleDescription
      }})
    let permission = await models.Permission.create({
      name: ctx.request.body.permissionName,
      display_name: ctx.request.body.permissionDisplayName,
      description: ctx.request.body.permissionDescription
    })
    await role.addPermission(permission)
    console.log('created: ' + JSON.stringify(role))
    ctx.rest({
      code: 'success',
      message: 'Created a role successfully'
    })
  } catch (err) {
    throw new ctx.APIError('roles:add_error', err)
  }
}

export default rolesController
