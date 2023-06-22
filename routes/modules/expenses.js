const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

// 路由：新增頁(new)
router.get('/new', (req, res) => {
  // 先找出Category的資料，結果存到categories
  Category.find()
    .lean()
    .then(categories => {
      res.render('new', { categories })
    })
})

router.post('/', (req, res) => {
  const { name, date, categoryName, amount } = req.body
  const userId = "6492b4eb257d00d8a027bd08" //測試資料，等登入功能完成後修改
  // 將日期從YYYY-MM-DD轉成YYYY/MM/DD
  let dateTW = new Date(date).toLocaleDateString('zh-TW')

  Category.findOne({ name: categoryName })
    .lean()
    .then(category => {
      let categoryId = category._id

      Record.create({
        name,
        date: dateTW,
        amount,
        userId,
        categoryId
      })
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 路由：編輯頁(edit)
router.get('/edit', (req, res) => {
  res.render('edit')
})

module.exports = router