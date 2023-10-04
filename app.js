if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const port = process.env.PORT || 3001
const express = require('express')
const { pages, apis } = require('./routes')
const handlebars = require('express-handlebars')
const passport = require('./config/passport')
const session = require("express-session")
const flash = require('connect-flash')
const app = express()
const { getUser } = require('./helpers/auth-helpers')
const methodOverride = require('method-override')
// set handlebars
app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')
//set session & initialize passport
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') // 設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages') // 設定 error_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg') // 設定 warning_msg 訊息
  res.locals.user = getUser(req)
  next()
})
app.use(pages)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app