const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const expenses = require('./modules/expenses')
const users = require('./modules/users')

router.use('/expenses', expenses)
router.use('/users',users)
router.use('/', home)

module.exports = router