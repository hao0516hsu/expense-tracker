const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', (req, res) => {
  // 先找出Category的資料，結果存到categories
  Category.find()
    .lean()
    .then(categories => {
      // 找出Record的資料，結果存到records
      Record.find()
        // populate要以'使用Schema.Types.ObjectId'的欄位名稱
        .populate('categoryId')
        .lean()
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

module.exports = router