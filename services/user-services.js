const {Student, Teacher, Lesson} = require('../models')
const bcrypt = require('bcryptjs')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
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
    Teacher.findAll({
        include: Lesson,
        where: {id : req.params.id},
        raw: true,
        nest: true
      })
      .then(teacher => {
        //設定此老師開始與結束時間
        let lessonTime
        for(let i = 0; i < teacher.length; i++){
          const time_temp = teacher[i].Lessons.startTime
          const usageTime = teacher[i].Lessons.usageTime 
          lessonTime = time_temp.toString().split(' GMT')[0]   
          if (usageTime === 60 && time_temp.getMinutes() === 30) {
            lessonTime += `-${time_temp.getHours() + 1}:${time_temp.getMinutes()}:00`
          } else if (usageTime === 60 && time_temp.getMinutes() === 0) {
            lessonTime += `-${time_temp.getHours() + 1}:${time_temp.getMinutes()}0:00`
          }else if (usageTime === 30 && time_temp.getMinutes() === 30) {
            lessonTime += `-${time_temp.getHours() + 1}:${time_temp.getMinutes() - 30}0:00`
          } else (
            lessonTime += `-${time_temp.getHours()}:${time_temp.getMinutes() + 30}:00`
          )
        }
        
        if(!teacher) throw new Error('查無此老師')
        cb(null, {
          teacher,
          lessonTime
        })    
      })
      .catch(err => cb(err))
  },
  selectLesson: (req, cb) => {
    console.log(req.params.id)
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

  }
}
module.exports = userServices