const express = require('express')
const router = express.Router()
const passport = require('../../../config/passport')
const userController = require('../../../controllers/apis/user-controller')
const { authenticated } = require('../../../middleware/api-auth')



router.post('/signup', userController.signUp)

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.get('/profile', authenticated, userController.profilePage)

router.get('/logout', authenticated, userController.logout)
router.put('/edit', authenticated, userController.editUserProfile)

router.get('/tutor', userController.indexPage)
router.get('/rank', authenticated, userController.getRank)
router.post('/newComment', authenticated, userController.newComment)
router.get('/tutor', authenticated, userController.indexPage)
router.get('/teacherProfileForStudent/:id', authenticated, userController.teacherPage)
router.post('/select/:id', authenticated, userController.selectLesson)
router.get('/unselected', authenticated, userController.getUnselectedLesson)
module.exports = router