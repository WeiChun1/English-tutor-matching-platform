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
router.get('/edit', authenticated, userController.editPage)
router.put('/edit', authenticated, userController.editUserProfile)
router.get('/teacherProfileForStudent/:id', authenticated, userController.teacherPage)
router.post('/newComment', authenticated, userController.newComment)
router.get('/tutor', authenticated, userController.indexPage)
router.post('/select/:id', authenticated, userController.selectLesson)
module.exports = router