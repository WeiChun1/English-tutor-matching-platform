const express = require('express')
const router = express.Router()
const { Teacher, Lesson, Student } = require('../../../models')
const teacherController = require('../../../controllers/pages/teacher-controller')
router.get('/', teacherController.createTeacherPage)
router.post('/', teacherController.createTeacher)
module.exports = router