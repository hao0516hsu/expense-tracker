const express = require('express')
const router = express.Router()

// 路由：新增頁(new)
router.get('/new',(req,res)=>{
  res.render('new')
})

// 路由：編輯頁(edit)
router.get('/edit', (req, res) => {
  res.render('edit')
})

module.exports = router