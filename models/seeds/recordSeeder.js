const Record = require('../record')
const User = require('../user')
const Category = require('../category')

const db = require('../../config/mongoose')

const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}

const SEED_RECORD = [
  {
    name: "早餐",
    date: "2023/1/1",
    amount: "100",
    category_name: "餐飲食品"
  },
  {
    name: "看棒球",
    date: "2023/1/1",
    amount: "450",
    category_name: "休閒娛樂"
  },
  {
    name: "捷運",
    date: "2023/1/1",
    amount: "80",
    category_name: "交通出行",
  },
]

db.once('open', () => {
  Promise.all(
    SEED_RECORD.map(item => {
      Category.findOne({ name: item.category_name })
        .then(category_attr => {
          item.category_id = category_attr._id
        })
    })
  )
    .then(
      User.create({
        name: SEED_USER.name,
        email: SEED_USER.email,
        password: SEED_USER.password
      })
        .then(user => {
          SEED_RECORD.map(record => {
            Record.create({
              name: record.name,
              date: record.date,
              amount: record.amount,
              userId: user._id,
              categoryId: record.category_id
            })
          })
        })
    )
})