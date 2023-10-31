const adminServices = require('../../services/admin-services')

const adminController = {
  getUserList: (req, res, next) => {
    adminServices.getUserList(req, (err, data) => err ? next(err) : res.render('userList', data))
  }
}

module.exports = adminController