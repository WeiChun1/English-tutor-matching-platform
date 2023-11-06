const teacherServices = require('../../services/teacher-services')

const teacherController = {
  createTeacher: (req, res, next) => {
    teacherServices.createTeacher(req, (err, data) =>{ 
      if (err) next(err)
      try {
        delete data.password
        res.json({
          status: 'success',
          data
        })
      }
      catch (err) {
        next(err)
      }
    })
  },
  editTeacher: (req, res, next) => {
    teacherServices.editTeacher(req, (err, data) => err ? next(err) : res.json({
      status: 'success',
      data: data.teacher
    }))
  },
  profilePage: (req, res, next) => {
    teacherServices.profilePage(req, (err, data) => err ? next(err) : res.json({
      status: 'success',
      information: data.information
    }))
  },
  getAllLesson: (req, res, next) => {
    teacherServices.getAllLesson(req, (err, data) => err ? next(err) : res.json({
      status: 'success',
      information: data
    }))
  }
}
module.exports = teacherController