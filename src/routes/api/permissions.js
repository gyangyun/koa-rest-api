import Router from 'koa-router'
import pmssController from '../../controllers/api/permissions'

const router = Router({
  prefix: '/permissions'
})
router.use('/', async (ctx, next) => {
  if (ctx.state.user.isAdmin) {
    await next()
  } else {
    ctx.body = 'Unauthorized'
  }
})

router.post('/', pmssController.store)
router.patch('/:id', pmssController.update)
router.delete('/:id', pmssController.destroy)
router.get('/', pmssController.list)
router.get('/:id', pmssController.show)
router.post('/bulkdelete', pmssController.bulkDestroy)

export default router
