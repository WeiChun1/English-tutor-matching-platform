'use strict';
const helpers = require('../helpers/day-helpers')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let lessons = []
    const week = [1,2,3,4,5,6,7]
    const time = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30",]
    const usage_time = [30, 60]
    const teachers = await queryInterface.sequelize.query(
      'SELECT id FROM Teachers;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    for (let temp = 0; temp < teachers.length; temp ++){
      let days = []
      const startTime = time[Math.floor(Math.random() * time.length)]
      const teacher_id = teachers[temp].id
      for (let i = 0; i < Math.ceil(Math.random() * 2) + 2; i++) {
        for (let n = 0; n < i; n++) {
          days.push(week[Math.floor(Math.random() * 7)])
          days = days.filter((day, index) => (days.indexOf(day) === index))
          if (days.length < i) n--
        }
      }
      days.map((day) => {
        for(let index = 0; index < 2; index++){
          let realStartTime = new Date();
          const timeTemp = startTime.split(":");
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
            linK: faker.internet.url(),
            teacher_id,
            start_time: realStartTime,
            usage_time: usage_time[Math.floor(Math.random() * usage_time.length)],
            created_at: new Date(),
            updated_at: new Date()
          })
        }
      })
    } 
    await queryInterface.bulkInsert('Lessons', lessons)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Lessons', {})
  }
};
