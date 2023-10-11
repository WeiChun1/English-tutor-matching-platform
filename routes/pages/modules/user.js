const express = require('express')
const router = express.Router()
const passport = require('../../../config/passport')
const userController = require('../../../controllers/pages/user-controller')
const { authenticated } = require('../../../middleware/auth')

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/profile', authenticated, userController.profilePage)
router.get('/logout', userController.logout)

router.get('/', authenticated, userController.indexPage)
module.exports = router