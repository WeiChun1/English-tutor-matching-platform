const teacherServices = require('../../services/teacher-services')

const teacherController = {
  createTeacherPage: (req, res) => {
    res.render('teachers/teacherInfo')
  },
  createTeacher: (req, res, next) => {
    teacherServices.createTeacher(req, (err, data) => err ? next(err) : res.redirect(`/tutor`))
  },
  editTeacherPage: (req, res, next) => {
    teacherServices.editTeacherPage(req, (err, data) => err ? next(err) : res.render('teachers/teacherInfo', { lesson: data }))
  },
  editTeacher: (req, res, next) => {
    teacherServices.editTeacher(req, (err, data) => err ? next(err) : res.redirect(`/teachers/profile`))
  },
  profilePage: (req, res, next) => {
    teacherServices.profilePage(req, (err, data) => err ? next(err) : res.render('teachers/teacherProfile', data))
  }
}
module.exports = teacherController