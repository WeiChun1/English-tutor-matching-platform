const { Student, Teacher, Lesson } = require('../models')
const bcrypt = require('bcryptjs')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { startTimeSet } = require('../helpers/day-helpers')
const moment = require('moment')
moment.suppressDeprecationWarnings = true;

const userServices = {
  signUp: (req, cb) => {
    if (req.body.password !== req.body.passwordCheck){
      throw new Error('Passwords do not match!')
    }
    Promise.all([
      Student.findOne({ where: { email: req.body.email } }),
      Teacher.findOne({ where: { email: req.body.email } })
    ])
      .then((user) => {
        // 因為分成兩個model 所以回傳時會是矩陣 找出有資料的那組
        user.map(user_temp => { if (user_temp) return user = user_temp })
        if (user[0] === null) user = null
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => Student.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(newUser => cb(null, { Student: newUser }))
      .catch(err => cb(err))
  },
  indexPage: (req, cb) => {
    const DEFAULT_LIMIT = 6
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    
    Promise.all([
      Teacher.findAndCountAll({ 
        offset,
        limit,
        raw: true 
      }),
      Student.findAll({ raw: true }),
      Teacher.findAll({ raw: true })
    ])
    .then(([teachers, students, allTeacher]) => {
      teachers.rows.map((teacher) => {
        if (teacher.teachStyle.length > 50){
          teacher.teachStyle = teacher.teachStyle.substring(0, 50) + '...'
        }
      })
      let keywords = req.query.keyword
          if (keywords) { 
            const keyword = req.query.keyword.trim().toLowerCase()
            const filterTeachersData = allTeacher.filter(data => data.name.toLowerCase().includes(keyword))
            for (let i = 0; i < filterTeachersData.length; i++) {

              if (filterTeachersData[i].teachStyle.length > 50) {
                filterTeachersData[i].teachStyle = filterTeachersData[i].teachStyle.substring(0, 50) + '...'
              }
            }
            keywords = keywords.trim()
            teachers.rows = filterTeachersData.slice(offset, offset + limit)
            teachers.count = filterTeachersData.length
          }
      
      cb(null, {
        teachers: teachers.rows,
        keywords,
        pagination: getPagination(limit, page, teachers.count)
      })
    })
    .catch(err => cb(err))
  },
  editUser: (req, cb) => {
    const { name, introdution } = req.body
    Student.findOne({ where: {id: req.user.id} })
      .then(student => {
        return student.update({
          name,
          introdution
        })
      })
      .then(student => cb(null, student))
      .catch(err => cb(err))
  },
  teacherPage: (req, cb) => {
    Promise.all([
      Teacher.findAll({
          include: Lesson,
          where: {id : req.params.id},
          raw: true,
          nest: true
        }),
      Lesson.findAll({
        raw: true,
        where:{ teacherId: req.params.id },
        order: [['updated_at', 'DESC']]
      })
    ])
      .then(([teacher, lessons]) => {
        
        //設定此老師開始與結束時間
        for (let i = 0; i < teacher.length; i++) {
          const startTime = teacher[i].Lessons.startTime
          const usageTime = teacher[i].Lessons.usageTime
          teacher[i].lessonTime = startTimeSet(startTime, usageTime)
        }
        let comments = []
        let score = []
        lessons.map(lesson => {
          if(lesson.comment){
            comments.push({
              content: lesson.comment,
              score: lesson.score
            })
          }
        })
        if(!teacher) throw new Error('查無此老師')
        cb(null, {
          teacher,
          comments: comments.slice(0, 2)
        })    
      })
      .catch(err => cb(err))
  },
  selectLesson: (req, cb) => {
    Lesson.findOne({
      where: { 
        startTime: req.body.startTime,
         teacherId: req.params.id 
      }
    })
    .then(lesson => {
      return lesson.update({
        studnetId: req.user.id,
        selected: true
      })
    })
    .then(lesson => {
      cb(null, lesson)
    })
    .catch(err => cb(err))
  },
  profilePage: (req, cb) => {
    Promise.all([
      Lesson.findAll({
        where: { studentId: req.user.id },
        order: [['updated_at', 'DESC']],
        raw: true,
        nest: true,
        include: Teacher
      })
    ])
      .then(([lessons]) => {
        
        let lessonUnscored = lessons.filter(lesson => !lesson.score).slice(0,4)
        lessonUnscored.map(lesson => {
          lesson.lessonTime = startTimeSet(lesson.startTime, lesson.usageTime)
        })
        cb(null, {
          lesson: lessons.slice(0, 2),
          lessonUnscored
        })
      })
      .catch(err => cb(err))
  }
}
module.exports = userServices