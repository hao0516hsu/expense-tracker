const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

// 函式庫
const utilities = {
  ConvertToSlashDate(dashDate) {
    return new Date(dashDate).toLocaleDateString('zh-TW')
  },
  ConvertToDashDate(slashDate) {
    // 1. 取出日期，並將年月日分開存入陣列
    const date = new Date(slashDate)
    const dateArray = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    // 2.判斷是否需要補0
    dateArray.map((value, index) => {
      if (value.toString().length < 2) {
        value = '0' + value.toString()
        dateArray.splice(index, 1, value)
      }
    })
    // 3. 重組成字串
    return dateArray.join('-')
  }
}

// Get路由：新增頁(new)
router.get('/new', (req, res) => {
  // 先找出Category的資料，結果存到categories
  Category.find()
    .lean()
    .then(categories => {
      res.render('new', { categories })
    })
})

// Post路由：新增頁(new)
router.post('/', (req, res) => {
  const { name, date, categoryName, amount } = req.body
  const userId = req.user._id
  // 將日期從YYYY-MM-DD轉成YYYY/MM/DD
  let slashDate = utilities.ConvertToSlashDate(date)

  Category.findOne({ name: categoryName })
    .lean()
    .then(category => {
      // 先到Category取得categoryId，再新增資料
      let categoryId = category._id

      Record.create({
        name,
        date: slashDate,
        amount,
        userId,
        categoryId
      })
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// Get路由：編輯頁(edit)
router.get('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id

  Category.find()
    .lean()
    .then(categories => {
      Record.findOne({ _id, userId })
        .populate('categoryId')
        .lean()
        .then(record => {
          // 將日期從YYYY/MM/DD轉成YYYY-MM-DD 給HTML的value
          dashDate = utilities.ConvertToDashDate(record.date)

          categories.map((category, index) => {
            if (category.name === record.categoryId.name) {
              categories[index]['isChoosed'] = true
            }
          })
          res.render('edit', { categories, record, dashDate })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

// Put路由：編輯頁(edit)
router.put('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  const { name, date, categoryName, amount } = req.body
  let slashDate = utilities.ConvertToSlashDate(date)

  Category.findOne({ name: categoryName })
    .then(category => {
      Record.findOne({ _id, userId })
        .then(record => {
          record.name = name
          record.date = slashDate
          record.amount = amount
          // record.userId = userId
          record.categoryId = category._id

          return record.save()
        })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

// Delete路由：刪除頁(delete)
router.delete('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id

  Record.findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})


module.exports = router