import usersController from '../../controllers/api/users'

// * POST /api/users[/] => api.user.store()
// * PATCH /api/users/:id => api.user.update()
// * DELETE /api/users/:id => api.user.destroy()
// * GET /api/users[/] => api.user.index()
// * GET /api/users/:id => api.user.show()

export default (router) => {
  router.post('/users', usersController.store)
  router.patch('/users/:id', usersController.update)
  router.delete('/users/:id', usersController.destroy)
  router.get('/users', usersController.list)
  router.get('/users/:id', usersController.show)
  router.post('/users/batchdelete', usersController.bulkDestroy)
}
