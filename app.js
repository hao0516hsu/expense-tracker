const express = require('express')
const exphbs = require('express-handlebars')

const routes = require('./routes/index')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = process.env.PORT
// Handlebars設定
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(routes)

app.listen(port, () => {
  console.log('App is running on http://localhost:3000')
})