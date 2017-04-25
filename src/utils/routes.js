import fs from 'fs'
import path from 'path'
import Router from 'koa-router'

export default function addRoutes (router, dirName, fileName = 'index.js') {
/*
  router: Router实例
  dirName: 需扫描的目录路径，一般是引入本模块的文件的__dirname(所在目录)，即index.js所在目录
  fileName: 不需要导入的文件名，一般是引入本模块的文件的__filename(文件名)，即'index.js'
 */
  fs
    .readdirSync(dirName)
    .filter(function (file) {
    /* 不需要导入的文件有：
      以'.'开头的文件
      引用本模块的文件，因为往往引用本模块的文件是index.js，而需要扫描的目录又是index.js所在目录，如果不过滤掉会造成递归导入index.js，然后死循环的
    且必须是文件夹(作为模块导入，表示文件夹下的index.js)或者.js文件 */
      return (file.indexOf('.') !== 0) && file !== path.basename(fileName) && (fs.statSync(path.join(dirName, file)).isDirectory() || file.slice(-3) === '.js')
    })
    .forEach(function (moduleFile) {
      let md = require(path.join(dirName, moduleFile)).default
      if (md instanceof Router) {
        // 如果导入的模块为Router的实例，则将导入的模块router的路由即其对应处理方法复制到当前模块的router实例中
        router.use(md.routes(), md.allowedMethods())
        // 如果导入的模块不是router实例，则默认认为它是自定义函数，用来为当前模块的router新增路由即其对应处理方法
      } else {
        if (md instanceof Function) md(router)
      }
    })
}
