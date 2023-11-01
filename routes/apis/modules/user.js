const express = require('express')
const router = express.Router()
const passport = require('../../../config/passport')
const userController = require('../../../controllers/apis/user-controller')
const { authenticated } = require('../../../middleware/auth')



//router.post('/signup', userController.signUp)

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
// router.get('/profile', authenticated, userController.profilePage)

// router.get('/logout', userController.logout)
// router.get('/edit', authenticated, userController.editPage)
// router.put('/edit', authenticated, userController.editUserProfile)
// router.get('/teacherProfileForStudent/:id', authenticated, userController.teacherPage)
// router.post('/newComment', authenticated, userController.newComment)
router.get('/tutor', userController.indexPage)
// router.post('/select/:id', authenticated, userController.selectLesson)
module.exports = router