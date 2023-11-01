const express = require('express')
const router = express.Router()

const adminController = require('../../../controllers/apis/admin-controller')

router.get('/', adminController.getUserList)

module.exports = router