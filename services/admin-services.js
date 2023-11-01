const { Student, Teacher } = require('../models')
const { getPagination } = require('../helpers/pagination-helper')
const adminServices = {
  getUserList: (req, cb) => {
    const DEFAULT_LIMIT = 15
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT

    Promise.all([
      Student.findAll({
        raw: true
      }),
      Teacher.findAll({
        raw: true
      })
    ])
    .then(([students, teachers]) => {
      let users = [...students.slice(1, -1) , ...teachers]
      let keywords = req.query.keyword
      users.map(user => {
        if (user.introdution.length > 100) {
          user.subIntrodution = user.introdution.substring(0, 100) + '...'
        }
      })
      if (keywords) {
        const keyword = req.query.keyword.trim().toLowerCase()
        users = users.filter(user => ((user.name.toLowerCase().includes(keyword)) || (user.introdution.toLowerCase().includes(keyword))))
        keywords = keywords.trim()
      }
      users.sort((a,b) => a.id - b.id)
      cb(null, { 
        users: users.slice(limit * (page - 1), limit * page),
        pagination: getPagination(limit, page, users.length)
      })
    })
    .catch(err => cb(err))
  }
}

module.exports = adminServices