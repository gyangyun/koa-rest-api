import Router from 'koa-router'
import usersController from '../../controllers/api/users'

const router = Router({
  prefix: '/users'
})
router.use('/', async (ctx, next) => {
  if (ctx.state.user.isAdmin) {
    await next()
  } else {
    // ctx.body = 'Unauthorized'
    await next()
  }
})

router.post('/', usersController.store)
router.patch('/:id', usersController.update)
router.delete('/:id', usersController.destroy)
router.get('/', usersController.list)
router.get('/:id', usersController.show)
router.post('/bulkdelete', usersController.bulkDestroy)
export default router
