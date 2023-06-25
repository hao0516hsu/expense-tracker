const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

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
    name: "的形我版你知道在沒日本",
    date: "2023/1/1",
    amount: "100",
    category_name: "餐飲食品"
  },
  {
    name: "風自己的是想才知道，家了也不",
    date: "2023/1/1",
    amount: "450",
    category_name: "休閒娛樂"
  },
  {
    name: "生活，共的事物偷偷，太的天",
    date: "2023/1/1",
    amount: "80",
    category_name: "交通出行",
  },
  {
    name: "我有海正面不了遇到一。到他",
    date: "2023/1/1",
    amount: "99999",
    category_name: "其他",
  }
]

db.once('open', () => {
  // 先從Category配測試資料的category_id
  SEED_RECORD.map((item, index) => {
    Category.findOne({ name: item.category_name })
      .then(category_attr => {
        SEED_RECORD[index].category_id = category_attr._id
      })
  })

  // 再新增測試帳號到User
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    })
    // 將配好category_id和userId的資料新增到Record
      .then(user => {
        Promise.all(
          SEED_RECORD.map(record => {
            return Record.create({
              name: record.name,
              date: record.date,
              amount: record.amount,
              userId: user._id,
              categoryId: record.category_id
            })
          })
        )
          .then(() => {
            console.log('RecordSeeder is executed.')
            process.exit()
          })
      })
    )
})