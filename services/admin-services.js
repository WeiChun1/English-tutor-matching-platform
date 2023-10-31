const { Student, Teacher } = require('../models')

const adminServices = {
  getUserList: (req, cb) => {
    Promise.all([
      Student.findAll({
        raw: true
      }),
      Teacher.findAll({
        raw: true
      })
    ])
    .then(([students, teachers]) => {
      const users = [...students.slice(1, -1) , ...teachers]
      users.sort((a,b) => a.id - b.id)
      cb(null, { users })
    })
    .catch(err => cb(err))
  }
}

module.exports = adminServices