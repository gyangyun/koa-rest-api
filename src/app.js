// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
import Koa from 'koa'
import middlewares from './middlewares'
import router from './routes'
import db from './models'

// 创建一个Koa对象表示web app本身:
const app = new Koa()

// add middlewares
// 因为中间件中拓展了许多功能，也对ctx封装了许多增强方法，这些方法需要在route的controller中使用，因为需要先导入各中间件
middlewares(app)

// add routes
app.use(router.routes(), router.allowedMethods())

// add models
db.sequelize.sync().then(
    console.log('db init over!')
)

export default app
