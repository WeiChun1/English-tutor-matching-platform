const userServices = require('../../services/user-services')
const jwt = require('jsonwebtoken')
const userController = {
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => {
      if(err) next(err)
      try {
        const userData = data.toJSON()
        delete userData.password
        res.json({
          status: 'success',
          userData
        })
      } 
      catch (err) {
        next(err)
      }
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
    userServices.profilePage(req, (err, data) => err ? next(err) : res.json({ status: 'success', information: data.information}))
  },
  logout: (req, res) => {
    req.logout()
    res.json({
      status: 'success'
    })
  },
  indexPage: (req, res, next) => {
    userServices.indexPage(req, (err, data) => err ? next(err) : res.json({
      status: 'success',
      teachers: data.teachers
    }))
  },
  editUserProfile: (req, res) => {
    userServices.editUserProfile(req, (err, data) => err ? next(err) : res.json({
      status: 'success',
      data
    }))
  },
  teacherPage: (req, res, next) => {
    userServices.teacherPage(req, (err, data) => err ? next(err) : res.json({
      status: 'success',
      data: data.information
    }))
  },
  selectLesson: (req, res, next) => {
    userServices.selectLesson(req, (err, data) => { 
      if (err) next(err)
      try {
        const userData = data.toJSON()
        res.json({
          status: 'success',
          userData
        })
      }
      catch (err) {
        next(err)
      }
     })
  },
  newComment: (req, res, next) => {
    userServices.newComment(req, (err, data) => {
      if (err) next(err)
      try {
        const userData = data.toJSON()
        res.json({
          status: 'success',
          userData
        })
      }
      catch (err) {
        next(err)
      }
    })
  },
  getRank: (req, res, next) => {
    userServices.getRank(req, (err, data) => err ? next(err) : res.json({ status: 'success', data })
  )},
  getUnselectedLesson: (req, res, next) => {
    userServices.getUnselectedLesson(req, (err, data) => err ? next(err) : res.json({
      status: 'success',
      data
    }))
  }
}
module.exports = userController