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
      .then(newUser => cb(null, newUser))
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
      Student.findAll({
        raw: true,
        order: [["learning_time", "DESC"]]
      }),
      Teacher.findAll({ raw: true })
    ])
    .then(([teachers, students, allTeacher]) => {
      for(let index = 0; index < students.length; index++){
        students[index].rank = index + 1
      }
      //把root先移除
      students = students.slice(0, -1)
      teachers.rows.map((teacher) => {
        if (teacher.teachStyle.length > 50){
          teacher.teachStyle = teacher.teachStyle.substring(0, 50) + '...'
        }
      })
      let keywords = req.query.keyword
      if (keywords) {
        const keyword = req.query.keyword.trim().toLowerCase()
        const filterTeachersData = allTeacher.filter(data => (data.name.toLowerCase().includes(keyword)) || (data.introdution.toLowerCase().includes(keyword)))
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
        students: students.slice(0,5),
        keywords,
        pagination: getPagination(limit, page, teachers.count)
      })
    })
    .catch(err => cb(err))
  },
  editUserProfile: (req, cb) => {
    const { name, introdution, password, avatar, email } = req.body
    if(!password){
      Student.findOne({ where: { id: req.user.id } })
        .then(student =>{
          return student.update({
            name,
            introdution,
          })
        })
        .then(student => cb(null, student))
        .catch(err => cb(err))
    }
    Promise.all([
      Student.findOne({ where: { id: req.user.id } }),
      bcrypt.hash(password, 10) 
    ])
      .then(([student, hash])=> {
        return student.update({
          name,
          introdution,
          email,
          password: hash, 
          avatar
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
        let unselectedLesson = []
        teacher.map(teacher => {
          //設定此老師開始與結束時間
          const startTime = teacher.Lessons.startTime
          const usageTime = teacher.Lessons.usageTime
          teacher.lessonTime = startTimeSet(startTime, usageTime)
          if(!teacher.Lessons.selected){
            unselectedLesson.push(teacher.lessonTime)
          }
        })
        let comments = []
        const { teachStyle, introdution, avatar } = teacher[0]
        teacher.avgScore = 0
        teacher.commentAmount = 0
        lessons.map(lesson => {
          if(lesson.comment){
            teacher.avgScore = (lesson.score + (teacher.avgScore * teacher.commentAmount)) / (teacher.commentAmount + 1)
            teacher.commentAmount++
            comments.push({
              content: lesson.comment,
              score: lesson.score,
            })
          }
        })
        const latestComment = comments.slice(0, 2)
        comments.sort((a, b) => b.score - a.score)
        if(comments.length > 4){
          comments = [...comments.slice(0,2) ,...comments.slice(-2)]
        }
        teacher.avgScore = teacher.avgScore.toFixed(1)
        if(!teacher) throw new Error('查無此老師')
        cb(null, {
          information: {
            avgScore: teacher.avgScore,
            bestworstComment: comments,
            teachStyle, 
            introdution, 
            avatar, 
            unselectedLesson
          },
          teacher,
          latestComment
        })    
      })
      .catch(err => cb(err))
  },
  selectLesson: (req, cb) => {
    Promise.all([
      Lesson.findOne({
        where: {
          startTime: req.body.startTime,
          teacherId: req.params.id
        }
      }),
      Student.findAll({
        where: {
          id: req.user.id
        },
        nest: true,
        raw: true,
        include: Lesson
      })
    ])
    .then(([lesson, student]) => {
      if (!lesson || lesson.selected) throw new Error('查無此課程或此課程已被選取')
      //比對是否有時間重複
      const timeStart = lesson.startTime
      const timeEnd = moment(timeStart).add(lesson.usageTime, 'm').toDate()
      let repeat = false
      student.map(selectedLesson => { 
        const selectedStart = selectedLesson.Lessons.startTime
        const selectedEnd = moment(selectedStart).add(selectedLesson.Lessons.usageTime, 'm').toDate()
        if (((timeStart - selectedStart >= 0) && (timeStart - selectedEnd < 0)) || ((timeEnd - selectedStart > 0) && (timeEnd - selectedEnd <= 0))){
          repeat = true
          return
        }
      })
      if (repeat) return
      return lesson.update({
        studentId: req.user.id,
        selected: true
      })
    })
    .then(lesson => {
      if(!lesson) throw new Error('學生此時段已有其他課程')
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
      }),
      Student.findAll({
        raw: true,
        order: [["learning_time", "DESC"]]
      })
    ])
      .then(([lessons, students]) => {
        let lessonUnscoredTeacherInfo = []
        let thisWeekLessonInfo = []
        //本週全部課程
        const thisWeekLesson = lessons.filter(lesson => 
          (new Date() - lesson.startTime) < 0 && (lesson.startTime.getDate() - new Date().getDate()) <= 7
        ).sort((a, b) => a.startTime - b.startTime)
        const { email, name, avatar } = req.user
        let rank = students.findIndex( student => student.id === req.user.id)
        lessons.map(lesson => {
          lesson.lessonTime = startTimeSet(lesson.startTime, lesson.usageTime)
        })
        let lessonUnscored = lessons.filter(lesson => !lesson.score)
        lessonUnscored = lessonUnscored.filter(lesson => new Date() - lesson.startTime > 0)
        
        lessonUnscored.map(lesson => {
          lessonUnscoredTeacherInfo.push({
            name: lesson.Teacher.name,
            avatar: lesson.Teacher.avatar
          })
        })
        thisWeekLesson.map(lesson => {
          thisWeekLessonInfo.push({
            avatar: lesson.Teacher.avatar,
            startTime: lesson.lessonTime,
            name: lesson.Teacher.name,
            link: lesson.link
          })
        })
        
        cb(null, {
          information: {
            thisWeekLessonInfo,
            lessonUnscoredTeacherInfo,
            email, 
            name, 
            avatar,
            rank
          },
          lesson: lessons.slice(0, 2),
          lessonUnscored: lessonUnscored.slice(0, 4),
          rank: rank + 1
        })
      })
      .catch(err => cb(err))
  },
  newComment: (req, cb) => {
    const { score, comment, time } = req.body
    const startTime = new Date(time.split('-')[0])
    if (!startTime) throw new Error('查無此課程')
    Lesson.findOne({
      where: { 
        startTime,
        studentId: req.user.id
       }
    })
    .then(lesson => {
      if (!lesson) throw new Error('查無此課程')
      const endTime = moment(startTime).add(lesson.usageTime, 'm').toDate()
      if ((new Date() - endTime) < 0) throw new Error('此課程尚未上完')
      lesson.update({
        score,
        comment
      })
      cb(null, lesson)
    })
    .catch(err => cb(err))
  },
  getRank: (req, cb) => {
    Student.findAll({
      order: [["learning_time", "DESC"]],
      raw: true
    })
    .then(students => {
      let studentsRank = []
      students = students.slice(0, 10)
      students.map(student => {
        studentsRank.push({
          name: student.name,
          learningTime: student.learningTime
        })
      })
      cb(null, studentsRank)
    })
    .catch(err => cb(err))
  },
  getUnselectedLesson: (req, cb) => {
    const DEFAULT_LIMIT = 12
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    Lesson.findAll({
      where: { 
        selected: false
     },
      raw: true,
      nest: true,
      include: Teacher
    })
    .then(lessons => {
      let teacher_info = []
      if(!lessons) throw new Error('目前課程已被預約完')
      lessons.map(lesson => {
        teacher_info.push({
          name: lesson.Teacher.name,
          avatar: lesson.Teacher.avatar,
          teachStyle: lesson.Teacher.teachStyle
        })
      })
      teacher_info = teacher_info.slice((page - 1) * limit, page * limit)
      cb(null, teacher_info)
    })
    .catch(err => cb(err))
  }
}
module.exports = userServices