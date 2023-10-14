const userServices = require('../../services/user-services')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功註冊帳號！')
      req.session.createdData = data
      return res.redirect('/signin')
    })
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    res.redirect('/tutor')
  },
  profilePage: (req, res) => {
    if(req.user.teachStyle){
      res.render('teachers/teacherProfile')
    }else{
      res.render('studentProfile')
    }
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  indexPage: (req, res, next) => {
    userServices.indexPage(req, (err, data) => err ? next(err) : res.render(('index'), data))
  },
  profileEdit: (req, res, next) => {
    res.ren
  },
  editPage: (req, res) => {
    res.render("edit")
  },
  editUser: (req, res) => {
    userServices.editUser(req, (err, data) => err ? next(err) : res.redirect('/profile'))
  },
  teacherPage: (req, res) => {
    userServices.teacherPage(req, (err, data) => err ? next(err) : res.render('teachers/teacherProfileForStudent',  {teacher: data}))
  }
}
module.exports = userController