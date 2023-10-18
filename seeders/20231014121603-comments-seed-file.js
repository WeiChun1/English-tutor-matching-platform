'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let comments = []
    const teachers = await queryInterface.sequelize.query(
      'SELECT id FROM Teachers;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    let students = await queryInterface.sequelize.query(
      'SELECT id FROM Students;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    students = students.slice(1)
    await teachers.map(teacher => {
      let students_id = []
      let temp = []
      for (let amount = 0; amount < Math.ceil(Math.random() * 3 - 1) + 2; amount++){
        students_id.push(students[Math.floor(Math.random() * students.length)])
        temp = students_id.filter((student, index) => students_id.indexOf(student) === index)
        if (temp.length < students_id.length){
          amount --
          students_id = temp
        }
      }
      for (let i = 0; i < students_id.length; i++){
        comments.push({
          score: Math.ceil(Math.random()*  5),
          content: faker.lorem.paragraph(),
          student_id: students_id[i].id,
          teacher_id: teacher.id,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    })
    await queryInterface.bulkInsert('Comments', comments)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
};
