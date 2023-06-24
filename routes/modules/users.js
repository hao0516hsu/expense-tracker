const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')

// Get路由: 登入頁(login)
router.get('/login', (req, res) => {
  res.render('login')
})

// Post路由: 登入頁(login)
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  }))

// Get路由: 註冊頁(register)
router.get('/register', (req, res) => {
  res.render('register')
})

// Post路由: 註冊頁(register)
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位必填！' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '確認密碼不一致！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }

  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: '此信箱已被註冊！'})
        return res.render('register', {
          errors,
          name,
          email,
          password,
          confirmPassword
        })
      }
      return User.create({ name, email, password })
        .then(() => res.redirect('/users/login'))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

// Get路由: 登出頁(logout)
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '您已成功登出！')
  res.redirect('/users/login')
})


module.exports = router