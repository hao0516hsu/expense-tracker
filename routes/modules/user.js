const express = require('express')
const router = express.Router()

// Get路由: 登入頁(login)
router.get('/login',(req,res)=>{
  res.render('login')
})

// Get路由: 註冊頁(register)
router.get('/register', (req, res) => {
  res.render('register')
})

module.exports = router