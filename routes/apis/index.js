const express = require('express')
const router = express.Router()

const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')
const auth = require('./modules/auth')
const teacher = require('./modules/teacher')
const user = require('./modules/user')
const admin = require('./modules/admin')

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/auth', auth)
router.use('/teachers', teacher)
router.use('/', user)
router.use('/', apiErrorHandler)

module.exports = router