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
  profilePage: (req, res, next) => {
    userServices.profilePage(req, (err, data) =>{
      if (err) return next(err)
      res.render('studentProfile', data)
    })
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
  editPage: (req, res) => { res.render("edit") },
  editUser: (req, res) => {
    userServices.editUser(req, (err, data) => err ? next(err) : res.redirect('/profile'))
  },
  teacherPage: (req, res, next) => {
    userServices.teacherPage(req, (err, data) => err ? next(err) : res.render('teachers/teacherProfileForStudent',  data))
  },
  selectLesson: (req, res, next) => {
    userServices.selectLesson(req, (err, data) => err ? next(err) : 123)
  }
}
module.exports = userController