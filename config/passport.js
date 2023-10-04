const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const { Student, Teacher } = require('../models')
// set up Passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, email, password, cb) => {
    Promise.all([
      Teacher.findOne({ where: { email } }),
      Student.findOne({ where: { email} }),
      
    ])
      .then((user) => {
        // 因為分成兩個model 所以回傳時會是矩陣 找出有資料的那組
        user.map(user_temp => { if (user_temp) return user = user_temp })
        if (user[0] === null) user = null
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        bcrypt.compare(password, user.password).then(res => {
          if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
          return cb(null, user)
        })
      })
  }
))
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK,
  profileFields: ['email', 'displayName']
}, (accessToken, refreshToken, profile, cb) => {
  const { name, email } = profile._json
  Promise.all([
    Student.findOne({ where: { email } }),
    Teacher.findOne({ where: { email } })
  ])
    .then(user => {
      // 因為分成兩個model 所以回傳時會是矩陣 找出有資料的那組
      user.map(user_temp => { if (user_temp) return user = user_temp })
      if(user[0] === null) user = null
      if (user) return cb(null, user)
      const randomPassword = Math.random().toString(36).slice(-8)
      bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(randomPassword, salt))
        .then(hash => Student.create({
          name,
          email,
          password: hash
        }))
        .then(user => cb(null, user))
        .catch(err => cb(err, false))
    })
}))
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK
},
  function (accessToken, refreshToken, profile, cb) {
    const { name, email } = profile._json
    console.log(name, email)
    Promise.all([
      Student.findOne({ where: { email } }),
      Teacher.findOne({ where: { email } })
    ])
      .then(user => {
        // 因為分成兩個model 所以回傳時會是矩陣 找出有資料的那組
        user.map(user_temp => { if (user_temp) return user = user_temp })
        if (user[0] === null) user = null
        if (user) return cb(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => Student.create({
            name,
            email,
            password: hash
          }))
          .then(user => cb(null, user))
          .catch(err => cb(err, false))
      })
  }
))
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  Promise.all([
    Student.findByPk(id),
    Teacher.findByPk(id)
  ])
    .then((user) => {
      user.map(user_temp => { if (user_temp) return user = user_temp })
      if (user[0] === null) user = null
      cb(null, user.toJSON())
    })
    .catch(err => cb(err))
})
module.exports = passport
