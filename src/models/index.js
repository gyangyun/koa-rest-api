import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
import config from 'config'
const dbConfig = config.get('Customer.dbConfig')
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig)
const db = {}

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js')
  })
  .forEach(function (file) {
    // sequelize.import的用法参考官方文档，参数为定义了Model的文件的文件路径，实际上也绑定了表到具体的数据库
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
