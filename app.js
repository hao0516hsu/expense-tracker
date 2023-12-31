const express = require('express')
const exphbs = require('express-handlebars')
// Body-Parser: 取得POST的資料(req.body)
const bodyParser = require('body-parser')
// Method-Override: RESTful API相關
const methodOverride = require('method-override')
// Express-Session: 產生Session
const session = require('express-session')
// Connect flash
const flash = require('connect-flash')

// DOTENV設定
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 引用路由
const routes = require('./routes')
// 引用Mongoose
require('./config/mongoose')
// 引用Passport
const usePassport = require('./config/passport')

const app = express()
const port = process.env.PORT

// Handlebars設定
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// Body-parser設定
app.use(bodyParser.urlencoded({ extended: true }))
// Method-override設定
app.use(methodOverride('_method'))

// Express-session設定
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

// 呼叫usePassport
usePassport(app)
// Connect flash設定
app.use(flash())
// Middleware
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

// 使用routes
app.use(routes)

app.listen(port, () => {
  console.log('App is running on http://localhost:3000')
})