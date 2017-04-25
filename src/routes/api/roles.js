import rolesController from '../../controllers/api/roles'

export default (router) => {
  router.post('/roles/', rolesController.store)
}
