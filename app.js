const express = require('express')
const exphbs = require('express-handlebars')
// Body-Parser: 取得POST的資料(req.body)
const bodyParser = require('body-parser')
// Method-Override: RESTful API相關
const methodOverride = require('method-override')

// 引用路由
const routes = require('./routes/index')
// DOTENV設定
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// 引用Mongoose
require('./config/mongoose')

const app = express()
const port = process.env.PORT

// Handlebars設定
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// Body-parser設定
app.use(bodyParser.urlencoded({ extended: true }))
// Method-override設定
app.use(methodOverride('_method'))
// 使用routes
app.use(routes)

app.listen(port, () => {
  console.log('App is running on http://localhost:3000')
})