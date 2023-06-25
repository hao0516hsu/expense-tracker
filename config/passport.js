const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
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