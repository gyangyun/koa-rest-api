# Koa2 RESTful API 服务器脚手架

---

[TOC]

---

这是一个基于Koa2的轻量级RESTful API Server脚手架，支持ES6。

**注意：因升级Koa版本至2.2.0，为配合相应的依赖项，故需要Node.js版本大于等于v7.8.0，NPM大于等于v4.2.0。**

约定使用JSON格式传输数据，POST、PUT、DELET方法支持的Content-Type为`application/x-www-form-urlencoded、multipart/form-data、application/json`可配置支持跨域。非上传文件推荐application/x-www-form-urlencoded。通常情况下返回application/json格式的JSON数据。

可选用mongodb、redis非关系型数据库和PostgreSQL, MySQL, MariaDB, SQLite, MSSQL关系型数据库，考虑RESTful API Server的实际开发需要，这里通过sequelize.js作为ORM，同时提通过Promise执行SQL直接操作Mysql数据库的方法（不管什么方法，注意安全哦）。

此脚手架只安装了一些和Koa2不冲突的搭建RESTful API Server的必要插件，附带每一个插件的说明。采用ESlint进行语法检查。

因此脚手架主要提供RESTful API，故暂时不考虑前端静态资源处理，只提供静态资源访问的基本方法便于访问用户上传到服务器的图片等资源。基本目录结构与vue-cli保持一致，可配合React、AngularJS、Vue.js等前端框架使用。在Cordova/PhoneGap中使用时需要开启跨域功能。

**免责声明：** 此脚手架仅为方便开发提供基础环境，任何人或组织均可随意克隆使用，使用引入的框架需遵循原作者规定的相关协议（框架列表及来源地址在下方）。采用此脚手架产生的任何后果请自行承担，本人不对此脚手架负任何法律责任，使用即代表同意此条。

目前暂未加入软件测试模块，下一个版本会加入该功能并提供集成方案。

China大陆用户请自行优化网络。

## 开发使用说明

### 安装数据库

依赖数据库有：

- mysql
- redis

### git clone

    git clone https://github.com/fourth04/koa-rest-api.git

### 修改配置文件

修改config里面的数据库相关配置

### 安装依赖

    cd koa-rest-api
    npm install

### 测试运行

    npm run start

访问： [http://127.0.0.1:3000/](http://127.0.0.1:3000/)

## NPM Scripts 作为任务执行器

用过 Gulp 和 Grunt 作为任务执行器之后，我认为作为`服务端项目`运行时 `npm script` 更好用。npm scripts 有个好处就是它允许你像调用全局安装的模块那样调用本地依赖的模块。下面是我在 package.json 中的用法：

```json
"scripts": {
  "start": "node start.js",
  "watch": "nodemon --exec npm run start",
  "build": "babel src -d build",
  "test": "npm run build; mocha --require 'babel-polyfill' --compilers js:babel-register"
}
```

- `start` script 运行 `start.js`。start.js文件根据是否开发模式，来选择不同的`app.js`文件，开发模式则`/src/app.js`，生产模式则`/build/app.js`
- `watch` script 使用 `nodemon` 工具执行 `start` script 脚本，nodemon 能在修改 app 后自动重启。`注意` nodemon 是作为一个本地开发依赖安装而不是全局安装。
- `build` script 执行 Babel 编译 src 文件夹下的文件并输出结果到 build 文件夹。
- `test` script 首先执行 build script 然后使用 `mocha` 测试。Mocha 依赖两个模块：`babel-polyfill` —— 用来提供编译运行时的依赖，`babel-register` —— 执行之前编译测试文件。

```bash
npm start # 开发模式和生产模式都从此命令启动，
npm watch # 开启开发模式之后对于 /src 目录内的任何改动会自动热替换生效
npm run build # build
npm test # 单元测试
```

## 开发环境说明

### 启动

    npm run watch

### 使用测试模块进行测试

流行的测试模块有：

- [chai](https://github.com/chaijs/chai).断言库，BDD / TDD assertion framework for node.js and the browser that can be paired with any testing framework.
- [mocha](https://github.com/mochajs/mocha).测试框架，simple, flexible, fun javascript test framework for node.js & the browser
- [supertest](https://github.com/visionmedia/supertest).API测试，Super-agent driven library for testing node.js HTTP servers using a fluent API

依赖安装：

    npm install --save-dev chai mocha supertest

app 的测试代码放在 test 文件夹。`apiSpec.js` 中有关于 app 的 API 的详细的测试用例：

```javascript
import { expect } from 'chai';
import request from 'supertest';
import app from '../build/app';
import config from '../build/config';
```

从 `chai` 和 `supertest` 分别导入 `expect` 和 `request`。我们使用 app 的预编译版本，为了保证相同代码测试的准确性，我们配置为生成环境。然后我们为 API 编写测试用例，利用 async/await 语法来保证测试步骤的执行顺序：

```javascript
describe('API', () => {
  const inst = app.listen(4000);

  describe('POST /:collection', () => {
    it('should add an event', async () => {
      const page = 'http://google.com';
      const encoded = encodeURIComponent(page);
      const res = await request(inst)
        .post(<code>/pageviews</code>)
        .set({
          Authorization: 'Key ' + config.key
        })
        .send({
          time: 'now',
          referrer: 'a',
          agent: 'b',
          source: 'c',
          medium: 'd',
          campaign: 'e',
          page: page
        })
        .expect(201);
      //到此，res 已经可用了，你可以使用 res.headers、res.body 等。不需要回调函数
      expect(res.body).to.be.empty;
    });
  });
});
```

注意传给 it 的函数都需要标记为 async。这意味着可以用 await 来执行异步任务，包括返回 then-able 对象的 supertest 请求，同样还可以 await 断言（expects）。


## debug环境说明

### 原生调试功能

    npm run start --debug

支持Node.js原生调试功能：[https://nodejs.org/api/debugger.html](https://nodejs.org/api/debugger.html)

### VSC IDE调试

### debug模块调试

## 开发环境部署

### build

生成node直接可以执行的代码到build目录：

```bash
npm run build

npm run start # 生产模式运行
Or
node build/app.js
```

### 使用 PM2 部署

当 app 开发完成并且测试通过，就可以将其部署在生产环境了。首先我们声明 `pm2.json` 用来维护 app 生产环境的配置：

```json
{
  "apps" : [
      {
        "name"        : "koa-rest-api",
        // 编译版本的 app 的入口
        "script"      : "start.js",
        // 在生产环节不用兼听文件的变化
        "watch"       : false,
        // 合并搜索实例产生的日志
        "merge_logs"  : true,
        // 日志详情加上自定义的时间戳格式
        "log_date_format": "YYYY-MM-DD HH:mm Z",
        "env": {
          // app 所需的环境变量
          "NODE_ENV": "production",
          "PORT": 3000
        },
        // 为 app 启动两个进程，并均衡负载。
        "instances": 2,
        // 以 cluster 方式启动 app
        "exec_mode"  : "cluster_mode",
        // 监听程序错误自动重启进程
        "autorestart": true
      }
  ]
}
```

如果你的 app 需要额外的服务（如一个定时任务），你可以把他们加到 pm2.json，他们会跟主服务同时启动。线上可以这样启动你的 app：

    pm2 start pm2.json

保存当前进程列表：

    pm2 save

PM2 也提供了许多监测的功能（pm2 list，pm2 info，pm2 monit）。它可以展示你的应用的内存使用情况。最基础的 Koa 应用每个 Node.js 进程消耗 44MB 内存。

PM2配合Docker部署说明： [http://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/](http://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/)

### Docker部署说明

```javascript
docker pull node
docker run -itd --name RESTfulAPI -v `pwd`:/usr/src/app -w /usr/src/app node node ./dist/app.js
```

通过'docker ps'查看是否运行成功及运行状态

### Linux/Mac 直接后台运行生产环境代码

有时候为了简单，我们也这样做：

    nohup node ./dist/app.js > logs/out.log &

查看运行状态（如果有'node app.js'出现则说明正在后台运行）：

    ps aux|grep app.js

查看运行日志

    cat logs/out.log

监控运行状态

    tail -f logs/out.log


### 配合Vue-cli部署说明

Vue-cli（Vue2）运行'npm run build'后会在'dist'目录中生成所有静态资源文件。推荐使用Nginx处理静态资源以达最佳利用效果，然后通过上述任意一种方法部署RESTful API服务器。前后端是完全分离的，请注意Koa2 RESTful API Server项目中config/main.json里面的跨域配置。

推荐的Nginx配置文件：

    server
        {
            listen 80;
            listen [::]:80;
            server_name abc.com www.abc.com; #绑定域名
            index index.html index.htm;
            root  /www/app/dist; #Vue-cli编译后的dist目录

            location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
            {
                expires      30d;
            }

            location ~ .*\.(js|css)?$
            {
                expires      12h;
            }

            location ~ /\.
            {
                deny all;
            }

            access_log off; #访问日志路径
        }

Docker中Nginx运行命令(将上述配置文件任意命名放置于nginx_config目录中即可)：

    $ docker run -itd -p 80:80 -p 443:443 -v `pwd`/nginx_config:/etc/nginx/conf.d nginx

## 部署后使用

### 先初始化数据库

初始化数据库，存于预配置的用户、角色、权限信息，主要是先添加Admin账号，然后才能用这个账号添加其他数据

    node ./build/init-db.js

### Linux

Linux环境下推荐使用[HTTPie](https://github.com/jakubroztocil/httpie)，一个cURL类似的命令行HTTP客户端

`注意：` Linux环境下：HTTPie使用时

- 双引号，只有双引号内才可使用环境变量，即`Authorization`这类Headers携带的参数值使用双引号
- 单引号，一般使用单引号，即作为Request Body使用的参数值使用单引号

#### 获取Access token

    http POST 127.0.0.1:3000/auth/token username='admin' password='qwe123!Q' grant_type='password'

#### 将Access token设置为环境变量方便使用

```bash
export JWT_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lIjoiZ3VveXkyIiwiZW1haWwiOiIxMzMwMjMzMTIxOUAxODkuY29tIiwiY3JlYXRlZF9hdCI6IjIwMTctMDQtMzBUMDM6Mzc6NDAuMDAwWiIsInVwZGF0ZWRfYXQiOiIyMDE3LTA0LTMwVDAzOjM3OjQwLjAwMFoiLCJSb2xlcyI6W3siaWQiOjEsIm5hbWUiOiJhZG1pbiIsImRpc3BsYXlfbmFtZSI6IlVzZXIgQWRtaW5pc3RyYXRvciIsImRlc2NyaXB0aW9uIjoiVXNlciBpcyBhbGxvd2VkIHRvIG1hbmFnZSBhbmQgZWRpdCBvdGhlciB1c2VycyIsIlBlcm1pc3Npb25zIjpbeyJpZCI6MSwibmFtZSI6ImVkaXQtdXNlcnMiLCJkaXNwbGF5X25hbWUiOiJFZGl0IFVzZXJzIiwiZGVzY3JpcHRpb24iOiJlZGl0IGV4aXN0aW5nIHVzZXJzIiwicGVybWlzc2lvbl9yb2xlIjp7ImNyZWF0ZWRfYXQiOiIyMDE3LTA0LTMwVDAzOjM3OjM4LjAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAxNy0wNC0zMFQwMzozNzozOC4wMDBaIiwicGVybWlzc2lvbl9pZCI6MSwicm9sZV9pZCI6MX19LHsiaWQiOjIsIm5hbWUiOiJ2aWV3LWVkaXQiLCJkaXNwbGF5X25hbWUiOiJWaWV3IEVkaXQiLCJkZXNjcmlwdGlvbiI6IlZpZXcgYW5kIGVkaXQgdGhlIGNvbnRlbnQiLCJwZXJtaXNzaW9uX3JvbGUiOnsiY3JlYXRlZF9hdCI6IjIwMTctMDQtMzBUMDM6Mzc6MzguMDAwWiIsInVwZGF0ZWRfYXQiOiIyMDE3LTA0LTMwVDAzOjM3OjM4LjAwMFoiLCJwZXJtaXNzaW9uX2lkIjoyLCJyb2xlX2lkIjoxfX1dLCJyb2xlX3VzZXIiOnsiY3JlYXRlZF9hdCI6IjIwMTctMDQtMzBUMDM6Mzc6NDAuMDAwWiIsInVwZGF0ZWRfYXQiOiIyMDE3LTA0LTMwVDAzOjM3OjQwLjAwMFoiLCJyb2xlX2lkIjoxLCJ1c2VyX2lkIjoxfX1dLCJpc0FkbWluIjp0cnVlLCJtYXgiOjk5OTk5OSwiZHVyYXRpb24iOjM2MDAwMDB9LCJpYXQiOjE0OTM1NjYxOTZ9.tRmIylOmcXjAJSzDGt9B-o7uDt3RScnThHLthedLjS8
```

#### 权限管理(需要Admin用户)

```
* POST /api/permissions[/] => api.permissions.store()
* DELETE /api/permissions/:id => api.permissions.destroy()
* POST /api/permissions/bulkdelete => api.permissions.bulkDestroy()
* PATCH /api/permissions/:id => api.permissions.update()
* GET /api/permissions[/] => api.permissions.index()
* GET /api/permissions/:id => api.permissions.show()
```

**新增单个权限数据**

    http POST 127.0.0.1:3000/api/permissions permissionName='test' permissionDisplayName='test' permissionDescription='test' Authorization:"Bearer $JWT_TOKEN"

**删除单个权限数据**

    http DELETE 127.0.0.1:3000/api/permissions/4 Authorization:"Bearer $JWT_TOKEN"

**删除多个权限数据**

    http POST 127.0.0.1:3000/api/permissions/bulkdelete permissionIds:='[4, 5]' Authorization:"Bearer $JWT_TOKEN"

**更改单个权限数据**

    http PATCH 127.0.0.1:3000/api/permissions permissionName='test' permissionDisplayName='test' permissionDescription='test' Authorization:"Bearer $JWT_TOKEN"

**查询所有权限数据**

    http 127.0.0.1:3000/api/permissions Authorization:"Bearer $JWT_TOKEN"

**查询单个权限数据**

    http 127.0.0.1:3000/api/permissions/4 Authorization:"Bearer $JWT_TOKEN"

#### 角色管理(需要Admin用户)

```
* POST /api/roles[/] => api.roles.store()
* DELETE /api/roles/:id => api.roles.destroy()
* POST /api/roles/bulkdelete => api.roles.bulkDestroy()
* PATCH /api/roles/:id => api.roles.update()
* GET /api/roles[/] => api.roles.index()
* GET /api/roles/:id => api.roles.show()
```

**新增单个角色数据**

    http POST 127.0.0.1:3000/api/roles roleName='normal:30qps' roleDisplayName='30 QPS Normal User' roleDescription='User is allowed to view and edit the content, his ratelimit is 30qps' permissionIds:='[4, 5]' Authorization:"Bearer $JWT_TOKEN"

**删除单个角色数据**

    http DELETE 127.0.0.1:3000/api/roles/4 Authorization:"Bearer $JWT_TOKEN"

**删除多个角色数据**

    http POST 127.0.0.1:3000/api/roles/bulkdelete roleIds:='[4, 5]' Authorization:"Bearer $JWT_TOKEN"

**更改单个角色数据**

    http PATCH 127.0.0.1:3000/api/roles roleName='normal:30qps' roleDisplayName='30 QPS Normal User' roleDescription='User is allowed to view and edit the content, his ratelimit is 30qps' permissionIds:='[4, 5]' Authorization:"Bearer $JWT_TOKEN"

**查询所有角色数据**

    http 127.0.0.1:3000/api/roles Authorization:"Bearer $JWT_TOKEN"

**查询单个角色数据**

    http 127.0.0.1:3000/api/roles/4 Authorization:"Bearer $JWT_TOKEN"

#### 用户管理(需要Admin用户)

```
* POST /api/users[/] => api.users.store()
* DELETE /api/users/:id => api.users.destroy()
* POST /api/users/bulkdelete => api.users.bulkDestroy()
* PATCH /api/users/:id => api.users.update()
* GET /api/users[/] => api.users.index()
* GET /api/users/:id => api.users.show()
```

**新增单个用户数据**

    http POST 127.0.0.1:3000/api/users username='test4' email='123456789@189.com' password='qwe123!Q' roleIds:='[4, 5]' Authorization:"Bearer $JWT_TOKEN"

**删除单个用户数据**

    http DELETE 127.0.0.1:3000/api/users/4 Authorization:"Bearer $JWT_TOKEN"

**删除多个用户数据**

    http POST 127.0.0.1:3000/api/users/bulkdelete userIds:='[4, 5]' Authorization:"Bearer $JWT_TOKEN"

**更改单个用户数据**

    http PATCH 127.0.0.1:3000/api/users/4 username='test4' email='123456789@189.com' password='qwe123!Q' roleIds:='[4, 5]' Authorization:"Bearer $JWT_TOKEN"

**查询所有用户数据**

    http 127.0.0.1:3000/api/users Authorization:"Bearer $JWT_TOKEN"

**查询单个用户数据**

    http 127.0.0.1:3000/api/users/4 Authorization:"Bearer $JWT_TOKEN"

#### 普通用户修改密码

    http PATCH 127.0.0.1:3000/api/users/4 username='test4' email='123456789@189.com' password='qwe123!Q' Authorization:"Bearer $JWT_TOKEN"

#### 限速规则说明

本RESTFUL API针对用户限速，限速多少通过`设置用户角色名称`体现，角色名称统一为:`normal:\dqp\w`，例如`normal:30qps`，翻译过来就是：`普通用户：30 query per second`

可用的单位有：

|字符串|单词|意思|
|---|---|---|
|s|second|秒|
|t|minute|分钟|
|h|hour|小时|
|d|day|天|
|w|week|周|
|m|month|月|

## 引入插件介绍

> 引入插件的版本将会持续更新

引入的插件：  
`koa@2 koa-body@2 koa-router@next koa-session2 koa-static2 koa-compose require-directory babel-cli babel-register babel-plugin-transform-runtime babel-preset-es2015 babel-preset-stage-2 gulp gulp-eslint eslint eslint-config-standard eslint-friendly-formatter eslint-plugin-html eslint-plugin-promise nodemailer promise-mysql`

**koa2**: HTTP框架  
 Synopsis: HTTP framework.  
 From: [https://github.com/koajs/koa](https://github.com/koajs/koa) v2

**koa-body**: body解析器  
 Synopsis: A full-feature koa body parser middleware.  
 From: [https://github.com/dlau/koa-body](https://github.com/dlau/koa-body)

**koa-router**: Koa路由  
 Synopsis: Router middleware for koa.  
 From: [https://github.com/alexmingoia/koa-router/tree/master/](https://github.com/alexmingoia/koa-router/tree/master/)

**koa-session2**: Session中间件  
 Synopsis: Middleware for Koa2 to get/set session.  
 From: [https://github.com/Secbone/koa-session2](https://github.com/Secbone/koa-session2)

**koa-static2**: 静态资源中间件  
 Synopsis: Middleware for Koa2 to serve a folder under a name declared by user.  
 From: [https://github.com/Secbone/koa-static2](https://github.com/Secbone/koa-static2)

**koa-compose**: 多个中间件组合成一个  
 Synopsis: Compose several middleware into one.  
 From: [https://github.com/koajs/compose](https://github.com/koajs/compose)

**require-directory**: 递归遍历指定目录  
 Synopsis: Recursively iterates over specified directory.  
 From: [https://github.com/troygoode/node-require-directory](https://github.com/troygoode/node-require-directory)

**babel-cli**: Babel编译ES6代码为ES5代码  
 Synopsis: Babel is a JavaScript compiler, ES6 to ES5.  
 From: [https://github.com/babel/babel/tree/master/packages/babel-cli](https://github.com/babel/babel/tree/master/packages/babel-cli)

**babel-register**: Babel开发环境实时编译ES6代码  
 Synopsis: Babel hook.  
 From: [https://github.com/babel/babel/tree/master/packages/babel-cli](https://github.com/babel/babel/tree/master/packages/babel-cli)

**babel-plugin-transform-runtime**: Babel配置ES6的依赖项  
**babel-preset-es2015**: 同上  
**babel-preset-stage-2**: 同上

**gulp**: 基于流的自动化构建工具  
 Synopsis: Gulp is a toolkit for automating painful or time-consuming tasks.  
 From: [https://github.com/gulpjs/gulp](https://github.com/gulpjs/gulp)

**gulp-eslint**: gulp的ESLint检查插件  
 Synopsis: A gulp plugin for ESLint.  
 From: [https://github.com/adametry/gulp-eslint](https://github.com/adametry/gulp-eslint)

**gulp-nodemon**: 修改JS代码后自动重启  
 Synopsis: nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.  
 From: [https://github.com/remy/nodemon](https://github.com/remy/nodemon)

**eslint**: JavaScript语法检查工具  
 Synopsis: A fully pluggable tool for identifying and reporting on patterns in JavaScript.  
 From:

**eslint-config-standard**: 一个ESlint配置 Synopsis: ESLint Shareable Config for JavaScript Standard Style.  
 From: [https://github.com/feross/eslint-config-standard](https://github.com/feross/eslint-config-standard)

**eslint-friendly-formatter**: 使得ESlint提示在Sublime Text或iterm2中更友好，Atom也有对应的ESlint插件。  
 Synopsis: A simple formatter/reporter for ESLint that's friendly with Sublime Text and iterm2 'click to open file' functionality  
 From: [https://github.com/royriojas/eslint-friendly-formatter](https://github.com/royriojas/eslint-friendly-formatter)

**eslint-plugin-html**: 检查HTML文件中的JS代码规范  
 Synopsis: An ESLint plugin to extract and lint scripts from HTML files.  
 From: [https://github.com/BenoitZugmeyer/eslint-plugin-html](https://github.com/BenoitZugmeyer/eslint-plugin-html)

**eslint-plugin-promise**: 检查JavaScript promises  
 Synopsis: Enforce best practices for JavaScript promises. From: [https://github.com/xjamundx/eslint-plugin-promise](https://github.com/xjamundx/eslint-plugin-promise)

**eslint-plugin-promise**: ESlint依赖项  
 Synopsis: ESlint Rules for the Standard Linter. From: [https://github.com/xjamundx/eslint-plugin-standard](https://github.com/xjamundx/eslint-plugin-standard)

**nodemailer**: 发送邮件  
 Synopsis: Send e-mails with Node.JS.  
 From: [https://github.com/nodemailer/nodemailer](https://github.com/nodemailer/nodemailer)

**promise-mysql**: 操作MySQL数据库依赖  
 Synopsis: Promise Mysql.  
 From: [https://github.com/lukeb-uk/node-promise-mysql](https://github.com/lukeb-uk/node-promise-mysql)

**sequelize**: 关系型数据库ORM  
 Synopsis: Sequelize is a promise-based ORM for Node.js.  
 From: [https://github.com/sequelize/sequelize](https://github.com/sequelize/sequelize)

**mysql**: MySQL库  
 Synopsis: A pure node.js JavaScript Client implementing the MySql protocol.  
 From: [https://github.com/mysqljs/mysql](https://github.com/mysqljs/mysql)

支持Koa2的中间件列表：[https://github.com/koajs/koa/wiki](https://github.com/koajs/koa/wiki)

**其它经常配合Koa2的插件：**

**koa-nunjucks-2**:  
一个好用的模版引擎，可用于前后端，nunjucks：[https://github.com/mozilla/nunjucks](https://github.com/mozilla/nunjucks)

**koa-favicon**:  
Koa的favicon中间件：[https://github.com/koajs/favicon](https://github.com/koajs/favicon)

**koa-server-push**:  
HTTP2推送中间件：[https://github.com/silenceisgolden/koa-server-push](https://github.com/silenceisgolden/koa-server-push)

**koa-convert**: 转换旧的中间件支持Koa2  
 Synopsis: Convert koa generator-based middleware to promise-based middleware.  
 From: [https://github.com/koajs/convert](https://github.com/koajs/convert)

**koa-logger**: 请求日志输出，需要配合上面的插件使用  
 Synopsis: Development style logger middleware for Koa.  
 From: [https://github.com/koajs/logger](https://github.com/koajs/logger)

**koa-onerror**:  
Koa的错误拦截中间件，需要配合上面的插件使用：[https://github.com/koajs/onerror](https://github.com/koajs/onerror)

**koa-multer**: 处理数据中间件  
 Synopsis: Multer is a node.js middleware for handling multipart/form-data for koa.  
 From: [https://github.com/koa-modules/multer](https://github.com/koa-modules/multer)

## 目录结构说明

```
|
├─config
├─logs
└─src
    ├─controllers
    │  ├─api
    │  └─auth
    │      └─strategies
    ├─middlewares
    ├─models
    ├─routes
    │  ├─api
    │  └─auth
    └─utils
```

## 各类主流框架调用RESTful API的示例代码（仅供参考）

### AngularJS (Ionic同)

    $http({
    	method: 'post',
    	url: 'http://localhost:3000/xxx',
    	data: {para1:'para1',para2:'para2'},
    	headers: {
    	    'Content-Type': 'application/x-www-form-urlencoded'
    	}
     }).success(function (data) {
     }).error(function (data) {
     })

### jQuery

    $.ajax({
      cache: false,
      type: 'POST',
      url: 'http://localhost:3000/xxx',
      data: {
          para1: para1
      },
      async: false,
      dataType: 'json',
      success: function (result) {
      },
      error: function (err) {
          console.log(err)
      }
    })

    // 上传文件
    //创建FormData对象
    var data = new FormData()
    //为FormData对象添加数据
    //
    $.each($('#inputfile')[0].files, function (i, file) {
      data.append('upload_file', file)
    })
    $.ajax({
      url: 'http://127.0.0.1:3000/api/upload_oss_img_demo',
      type: 'POST',
      data: data,
      cache: false,
      contentType: false,    //不可缺
      processData: false,    //不可缺
      success: function (data) {
        console.log(data)
        if (data.result == 'ok') {
          $('#zzzz').attr('src', data.img_url)
        }

      }
    })

### MUI

    mui.ajax({ url: 'http://localhost:3000/xxx', dataType: 'json',
      success: function(data){

      },
      error: function(data){
          console.log('error!')
      }
    })

### JavaScript

      var xhr = new XMLHttpRequest()
      xhr.open('POST', 'http://localhost:3000/xxx', true) //POST或GET，true（异步）或 false（同步）
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhr.withCredentials = true
      xhr.onreadystatechange = function () {
          if (obj.readyState == 4 && obj.status == 200 || obj.status == 304) {
              var gotServices = JSON.parse(xhr.responseText)
          }else{
              console.log('ajax失败了')
          }
      }
      xhr.send({para1: para1})

### vue-resource

[https://github.com/pagekit/vue-resource](https://github.com/pagekit/vue-resource)

    // global Vue object
    Vue.http.post('/someUrl', [body], {
      headers: {'Content-type', 'application/x-www-form-urlencoded'}
    }).then(successCallback, errorCallback)

### fetch

[https://github.com/github/fetch](https://github.com/github/fetch)

    fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Hubot',
        login: 'hubot',
      })
    }).then(function(response) {
      // response.text()
    }).then(function(body) {
      // body
    })

    // 文件上传
    var input = document.querySelector('input[type='file']')

    var data = new FormData()
    data.append('file', input.files[0])
    data.append('user', 'hubot')

    fetch('/avatars', {
      method: 'POST',
      body: data
    })

### superagent

[https://github.com/visionmedia/superagent](https://github.com/visionmedia/superagent)

    request.post('/user')
     .set('Content-Type', 'application/json')
     .send('{'name':'tj','pet':'tobi'}')
     .end(callback)

### request

[https://github.com/request/request](https://github.com/request/request)

    request.post('/api').form({key:'value'}), function(err,httpResponse,body){ /* ... */ })

在React中可以将上述任意方法其置于componentDidMount()中，Vue.js同理。

## 彻底移除ESlint方法

删除package.json的devDependencies中所有eslint开头的插件，根目录下的“.eslintignore、.eslintrc.js”文件。
