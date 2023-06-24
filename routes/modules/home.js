const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

// GET路由: 首頁
router.get('/', (req, res) => {
  const userId = req.user._id
  // 先找出Category的資料，結果存到categories
  Category.find()
    .lean()
    .then(categories => {
      // 找出Record的資料，結果存到records
      Record.find({ userId })
        // populate要以'使用Schema.Types.ObjectId'的欄位名稱
        .populate('categoryId')
        .lean()
        .sort({ _id: 'desc' })
        .then(records => {
          let totalAmount = 0

          records.map((record, index) => {
            // 判斷該項為奇偶數, 並新增屬性到records
            if (index % 2) {
              records[index]['isEven'] = false
            } else {
              records[index]['isEven'] = true
            }
            // 計算花費總額(totalAmount)
            totalAmount += record.amount
          })
          // 將categories, records, totalAmount傳到handlebard
          res.render('index', { categories, records, totalAmount })
        })
    })
})

// GET路由: 首頁+搜尋
router.post('/', (req, res) => {
  // 取出Select Menu的值
  const { categoryName } = req.body
  const userId = req.user._id

  // 1-a. 若沒有選取，跳轉回首頁
  if (!categoryName) {
    res.redirect('/')
    // 1-b. 有選取的狀況 
  } else {
    // 先找出Category的資料，結果存到categories
    Category.find()
      .lean()
      .then(categories => {
        // 將Select Menu的categoryName給到categoryId
        let categoryId = ''

        categories.forEach(category => {
          if (category.name === categoryName) {
            categoryId = category._id
            category['isChoosed'] = true
          }
        })

        // 找出Record的資料，結果存到records
        Record.find({ categoryId, userId })
          // populate要以'使用Schema.Types.ObjectId'的欄位名稱
          .populate('categoryId')
          .lean()
          .sort({ _id: 'desc' })
          .then(records => {
            let totalAmount = 0
            // 判斷該項為奇偶數, 並新增屬性到records
            records.map((record, index) => {
              if (index % 2) {
                records[index]['isEven'] = false
              } else {
                records[index]['isEven'] = true
              }
              // 計算花費總額(totalAmount)
              totalAmount += record.amount
            })
            // 將categories, records, totalAmount傳到handlebars
            res.render('index', { categories, records, totalAmount, categoryName })
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }
})

module.exports = router