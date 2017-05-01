import Router from 'koa-router'
import rolesController from '../../controllers/api/roles'

const router = Router({
  prefix: '/roles'
})
router.use('/', async (ctx, next) => {
  if (ctx.state.user.isAdmin) {
    await next()
  } else {
    ctx.body = 'Unauthorized'
  }
})

router.post('/', rolesController.store)
router.patch('/:id', rolesController.update)
router.delete('/:id', rolesController.destroy)
router.get('/', rolesController.list)
router.get('/:id', rolesController.show)
router.post('/bulkdelete', rolesController.bulkDestroy)

export default router
