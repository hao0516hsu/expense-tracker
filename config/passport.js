// Passport: 登入驗證
const passport = require('passport')
// Passport-local: 驗證策略- 本地驗證
const LocalStrategy = require('passport-local').Strategy
// Passport-local: 驗證策略- 臉書登入
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')
// Bcryptjs: 密碼雜湊
const bcrypt = require('bcryptjs')

module.exports = app => {
  // 初始化
  app.use(passport.initialize());
  app.use(passport.session());

  // Local Strategy
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true // 取得LocalStrategy的req
    },
    // 函數新增參數: req 
    (req, email, password, done) => {
      User.findOne({ email })
        .then(user => {
          if (!user) {
            // 將{message: ''} 改成 req.flash('warning_msg','')
            return done(null, false, req.flash('warning_msg', '無此使用者！'))
          }
          // 用bcrypt.compare比對密碼
          bcrypt.compare(password, user.password)
            .then(isMatch => {
              if (!isMatch) {
                return done(null, false, req.flash('warning_msg', '密碼錯誤！'))
              }
              return done(null, user)
            })
        })
        .catch(err => done(err, false))
    }
  ));

  // Facebook Strategy
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  },
    (accessToken, refreshToken, profile, done) => {
      const { email, name } = profile._json

      User.findOne({ email })
        .then(user => {
          if (user) {
            return done(null, user)
          }
          const randomPassword = Math.random().toString(36).slice(-8)
          bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(randomPassword, salt))
            .then(hash => {
              User.create({
                name,
                email,
                password: hash
              })
            })
            .then(user => done(null, user))
            .catch(err => done(err, false))
        })
        .catch(err => done(err, false))
    }
  ))

  // 序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  });
}