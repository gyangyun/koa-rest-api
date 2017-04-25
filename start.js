const port = process.env.PORT || 3000
const env = process.env.NODE_ENV || 'development'
const src = env === 'production' ? './build/app' : './src/app'

require('babel-polyfill')
if (env === 'development') {
  require('babel-register')
}

const app = require(src).default
app.listen(port)
console.log(`app started at port ${port}...`)
