'use strict';
const helpers = require('../helpers/day-helpers')
const faker = require('faker')
const { Teacher } = require('../models')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let lessons = []
    let comments = []
    const week = [1,2,3,4,5,6,7]
    const time = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30",]
    const usageTime = [30, 60]
    const teachers = await queryInterface.sequelize.query(
      'SELECT id FROM Teachers;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const students = await queryInterface.sequelize.query(
      'SELECT id FROM Students;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    
    teachers.map(teacher => {
      let days = []
      const startTime = time[Math.floor(Math.random() * time.length)]
      const usageTemp = usageTime[Math.floor(Math.random() * usageTime.length)]
      const teacher_id = teacher.id
      const link = faker.internet.url()
      let student_id
      let comment_amount = 0
      
      for (let i = 0; i < Math.ceil(Math.random() * 2) + 2; i++) {
        for (let n = 0; n < i; n++) {
          days.push(week[Math.floor(Math.random() * 7)])
          days = days.filter((day, index) => (days.indexOf(day) === index))
          if (days.length < i) n--
        }
      }
      days.map((day) => {
        
        for (let index = 0; index < 2; index++) {
          let realStartTime = new Date();
          let comment, score
          const selected = Math.random() > 0.5
          const timeTemp = startTime.split(":")
          if (selected || comment_amount < 2) {
            student_id = students[Math.floor(Math.random() * (students.length - 1)) + 1].id
            if (Math.random() < 0.5 || comment_amount < 2){
              comment = faker.lorem.paragraph()
              score = Math.ceil(Math.random() * 4 + 1)
              comment_amount ++
            }
          }
          //設定起始時間 與近2週課程
          realStartTime.setHours(Number(timeTemp[0]), Number(timeTemp[1]), 0);
          if (day <= realStartTime.getDay()) {
            realStartTime = helpers.addDays(realStartTime, 7 - realStartTime.getDay() + day);
          } else {
            realStartTime = helpers.addDays(realStartTime, day - realStartTime.getDay());
          }
          if (index % 2 === 1) {
            realStartTime = helpers.addDays(realStartTime, 7);
          }

          lessons.push({
            link,
            teacher_id,
            student_id,
            comment,
            score,
            selected,
            start_time: realStartTime,
            usage_time: usageTemp,
            created_at: new Date(),
            updated_at: new Date()
          })
        }
      })
    })
    await queryInterface.bulkInsert('Lessons', lessons)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Lessons', {})
  }
};
