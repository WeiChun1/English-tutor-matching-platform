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
            console.log(realStartTime)
            const timeTemp = startTime.split(":")
            const day = Number(days[Math.floor(index / 2)])
            //設定起始時間 與近2週課程
            realStartTime.setHours(Number(timeTemp[0]) + 8, Number(timeTemp[1]), 0)
            if (day <= realStartTime.getDay()) {
              realStartTime = helpers.addDays(realStartTime, 7 - realStartTime.getDay() + day)
            } else {
              realStartTime = helpers.addDays(realStartTime, day - realStartTime.getDay())
            }
            if (index % 2 === 1) {
             realStartTime = helpers.addDays(realStartTime, 7)
            }
            console.log(realStartTime)
            return Lesson.create({
              startTime: realStartTime,
              usageTime,
              link
            })
          }),
          Teacher.create({
            ...req.user,
            teachStyle,
            introdution
          })
        ])
      
          .then(([lessons, teacher]) => {
            cb(null, teacher)
          })
      })
      .catch(err => cb(err))
  }
}
module.exports = teacherServices

