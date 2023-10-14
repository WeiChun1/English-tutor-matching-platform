const { Student, Teacher, Lesson } = require('../models')
const helpers = require('../helpers/day-helpers')
const teacherServices = {
  createTeacher: (req, cb) => {
    const { startTime, introdution, teachStyle, usageTime, link, days } = req.body
    if (!days) throw new Error("請至少選擇一日")
    
    Student.findOne({ where: { id: req.user.id } })
      .then(Student => {
        if (!Student) throw new Error("已成為老師，如需更改資料請至個人資料")
        return Student.destroy()
      })
      .then(() => {
        Promise.all([
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
            cb(null, {lessons, teacher})
          })
      })
      .catch(err => cb(err))
  },
  editTeacherPage: (req, cb) => {
    Lesson.findAll({ 
      where: { teacherId : req.user.id},
      raw: true
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
    const { startTime, introdution, teachStyle, usageTime, link, days, name } = req.body
    if (!days) throw new Error("請至少選擇一日")

    Lesson.findAll({ where: { teacherId: req.user.id } })
      .then(Lessons => {
        if (!Lessons) throw new Error("尚未開課程")
        for(let i = 0; i < Lessons.length; i ++){
          Lessons[i].destroy()
        }  
      })
      .then(() => {
        Promise.all([
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
          Teacher.findOne({ 
            where: { id: req.user.id },
          })
            .then(teacher => {
              return teacher.update({
                ...req.user,
                name,
                teachStyle,
                introdution
              })
            })
        ])
          .then(([lessons, teacher]) => {
            //console.log(JSON.stringify(teacher))
            cb(null, {lessons, teacher})
          })
      })
      .catch(err => cb(err))
  }
}
module.exports = teacherServices

