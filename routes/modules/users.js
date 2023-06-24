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

  User.findOne({ email })
    .then(user => {
      if (user) {
        console.log('This email has already been registered.')

        res.render('register', { name, email, password, confirmPassword })
      } else {
        User.create({ name, email, password })
          .then(() => res.redirect('/users/login'))
          .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))
})

// Get路由: 登出頁(logout)
router.get('/logout',(req,res)=>{
  req.logout()
  res.redirect('/users/login')
})


module.exports = router