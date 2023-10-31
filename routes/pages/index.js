const express = require('express')
const router = express.Router()

const { authenticated, authenticatedAdmin} = require('../../middleware/auth')
const { generalErrorHandler } = require('../../middleware/error-handler')
const auth = require('./modules/auth')
const teacher = require('./modules/teacher')
const user = require('./modules/user')
const admin = require('./modules/admin')

router.use('/admin', authenticatedAdmin, admin)
router.use('/auth', auth)
router.use('/teachers', authenticated, teacher)
router.use('/', user)
router.use('/', generalErrorHandler)

module.exports = router