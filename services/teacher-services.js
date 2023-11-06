const { Student, Teacher, Lesson, Comment } = require('../models')
const helpers = require('../helpers/day-helpers')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const teacherServices = {
  createTeacher: (req, cb) => {
    const { startTime, introdution, teachStyle, usageTime, link, days } = req.body
    if (!days) throw new Error("請至少選擇一日")
    Student.findOne({ where: { id: req.user.id }})
      .then(Student => {
        if (!Student) throw new Error("已成為老師，如需更改資料請至個人資料")
        return Student.destroy()
      })
      .then(() => {
        return Promise.all([
          Array.from({ length: 2 * days.length }, (_, index) => {
            
            let realStartTime = new Date()
            const timeTemp = startTime.split(":")
            const day = Number(days[Math.floor(index / 2)])
            //設定起始時間 與近2週課程
            realStartTime.setHours(Number(timeTemp[0]), Number(timeTemp[1]), 0)
            if (day <= realStartTime.getDay()) {
              realStartTime = helpers.addDays(realStartTime, 7 - realStartTime.getDay() + day)
            } else {
              realStartTime = helpers.addDays(realStartTime, day - realStartTime.getDay())
            }
            if (index % 2 === 1) {
             realStartTime = helpers.addDays(realStartTime, 7)
            }
            return Lesson.create({
              startTime: realStartTime,
              usageTime,
              link,
              teacherId: req.user.id
            })
          }),
          Teacher.create({
            ...req.user,
            teachStyle,
            introdution
          })
        ])
          .then(([lessons, teacher]) => {
            cb(null, {
              ...teacher,
              days
            })
          })
      })
      .catch(err => cb(err))
  },
  editTeacherPage: (req, cb) => {
    Lesson.findAll({ 
      where: { teacherId : req.user.id},
      raw: true,
      order: [['updated_at', 'DESC']]
    })
      .then((lessons) => {
        let days = []
        if(!lessons) throw new Error('查無此老師')
        lessons.map(lesson => {
          let day = lesson.startTime.getDay()
          days.push(day)
        })
        days = days.filter((day, index) => (days.indexOf(day) === index))
        lessons[0].startTime = `${{ ...lessons[0] }.startTime.getHours()}:${{ ...lessons[0] }.startTime.getMinutes()}`
        cb(null, { ...lessons[0], days})
      })
      .catch(err => cb(err))
  },
  editTeacher: (req, cb) => {
    const { startTime, introdution, teachStyle, usageTime, link, name, email, password, avatar } = req.body
    let { days } = req.body
    if (!days) throw new Error("請至少選擇一日")

    Lesson.findAll({ 
      where: { 
        teacherId: req.user.id
      }
    })
      .then(Lessons => {
        if (!Lessons) throw new Error("尚未開課程")
        let days_temp = [days]
        if(days.length > 1) days_temp = days
        Lessons.map(Lesson => {
          if (`${Lesson.startTime.getHours()}:${Lesson.startTime.getMinutes()}` !== startTime || Lesson.usageTime !== Number(usageTime)){
            const day = Lesson.startTime.getDay()
            //days_temp = days_temp.filter(a => a !== String(day))
            if (!Lesson.selected && !days.includes(String(day))) {
              Lesson.destroy()
            }
          } else if(!Lesson.selected) {
              Lesson.destroy()
          }
        })
      })
      .then(() => {
        return Promise.all(
          Array.from({ length: 2 * days.length }, (_, index) => {
            let realStartTime = new Date()
            const timeTemp = startTime.split(":")
            const day = Number(days[Math.floor(index / 2)])
            //設定起始時間 與近2週課程
            realStartTime.setHours(Number(timeTemp[0]), Number(timeTemp[1]), 0)
            if (day <= realStartTime.getDay()) {
              realStartTime = helpers.addDays(realStartTime, 7 - realStartTime.getDay() + day)
            } else {
              realStartTime = helpers.addDays(realStartTime, day - realStartTime.getDay())
            }
            if (index % 2 === 1) {
              realStartTime = helpers.addDays(realStartTime, 7)
            }
            return Lesson.create({
              startTime: realStartTime,
              usageTime,
              link,
              teacherId: req.user.id,
            })
          })
        )
          .then(() => {
            let lesson_repeat = []
            Promise.all([
              Teacher.findOne({where: { id: req.user.id } }),
              Lesson.findAll({ where: { teacherId: req.user.id }})
            ])
              .then(([teacher, lessons]) => {
                lessons.map(lesson => {
                  if (lesson_repeat.includes(lesson.startTime.getDate())) {
                    lesson.destroy()
                  } else {
                    lesson_repeat.push(lesson.startTime.getDate())
                  }
                })
                teacher.update({
                  ...req.user,
                  name,
                  teachStyle,
                  introdution,
                  email, 
                  password, 
                  avatar
                })
                return {teacher, lessons}
              })
              .then(({teacher, lessons}) => {
                cb(null, {  lessons, teacher })
              })
          })
      })
      .catch(err => cb(err))
  },
  profilePage: (req, cb) => {
    const {email, name, avatar, introdution} = req.user
    Lesson.findAll({
        where: {
          teacherId: req.user.id,
          selected: true,
        },
        order: [['updated_at', 'DESC']],
        raw: true,
        nest: true,
        include: Student
    })
    .then((lessons) => {
      let comments = []
      let lessonsInfo = []
      let avgScore = 0
      let commentAmount = 0
      lessons.map(lesson => {
        lesson.lessonTime = helpers.startTimeSet(lesson.startTime, lesson.usageTime)
        if (lesson.comment) {
          avgScore = (lesson.score + (avgScore * commentAmount)) / (commentAmount + 1)
          commentAmount++
          comments.push({
            name: lesson.Student.name,
            content: lesson.comment,
            score: lesson.score
          })
        }
      })
      avgScore = avgScore.toFixed(1)
      lessons = lessons.filter(lesson => (lesson.startTime - new Date()) > 0)
      const lessons_7Days = lessons.filter(lesson => (lesson.startTime.getDate() - new Date().getDate()) <= 7 )
      lessons_7Days.map(lesson => {
        lessonsInfo.push({
          name: lesson.Student.name,
          startTime: lesson.lessonTime
        })
      })
      cb(null, { 
        information: { 
          email,
          name, 
          avatar, 
          avgScore, 
          introdution,
          comments,
          lessonsInfo
        },
        lesson: lessons.slice(0,2),
        comment: comments.slice(0,2)
      })
    })
    .catch(err => cb(err))
  },
  getAllLesson: (req, cb) => {
    const DEFAULT_LIMIT = 6
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    Lesson.findAll({
      offset,
      limit,
      where: { teacherId: req.user.id },
      raw: true
    })
    .then(lessons => {
      if(!lessons) throw new Error('尚未有課程紀錄')
      cb(null, lessons)
    })
    .catch(err => cb(err))
  }
}
module.exports = teacherServices

