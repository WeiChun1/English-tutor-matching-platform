const { Student, Teacher, Lesson } = require('../../models')
const teacherServices = require('../../services/teacher-services')

const teacherController = {
  createTeacherPage: (req, res) => {
    res.render('teachers/createTeacher')
  },
  createTeacher: (req, res, next) => {
    teacherServices.createTeacher(req, (err, data) => err ? next(err) : res.redirect(`/profile/${req.user.id}`))
  }
}
module.exports = teacherController