const adminServices = require('../../services/admin-services')

const adminController = {
  getUserList: (req, res, next) => {
    adminServices.getUserList(req, (err, data) => err ? next(err) : res.json(data))
  }
}

module.exports = adminController