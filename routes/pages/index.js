const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const userController = require('../../controllers/pages/user-controller')
const { authenticated, authenticatedAdmin} = require('../../middleware/auth')
const { generalErrorHandler } = require('../../middleware/error-handler')
const auth = require('./modules/auth')
//router.use('/admin', authenticatedAdmin, admin)
router.use('/auth', auth)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)
router.get('/', authenticated, (req, res) => res.render('index'))
router.use('/', generalErrorHandler)

module.exports = router