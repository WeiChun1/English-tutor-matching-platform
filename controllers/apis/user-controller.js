const userServices = require('../../services/user-services')
const jwt = require('jsonwebtoken')
const userController = {
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功註冊帳號！')
      req.session.createdData = data
      return res.redirect('/signin')
    })
  },
  signIn: (req, res, next) => {   
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          userData
        }
      })
    } catch (err) {
      next(err)
    }
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
    userServices.indexPage(req, (err, data) => err ? next(err) : res.json(data))
  },
  editPage: (req, res) => { res.render("edit") },
  editUserProfile: (req, res) => {
    userServices.editUserProfile(req, (err, data) => err ? next(err) : res.redirect('/profile'))
  },
  teacherPage: (req, res, next) => {
    userServices.teacherPage(req, (err, data) => err ? next(err) : res.render('teachers/teacherProfileForStudent',  data))
  },
  selectLesson: (req, res, next) => {
    userServices.selectLesson(req, (err, data) => {if(err) return next(err)})
  },
  newComment: (req, res, next) => {
    userServices.newComment(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '評論成功')
      return res.redirect('/profile')
    })
  }
}
module.exports = userController