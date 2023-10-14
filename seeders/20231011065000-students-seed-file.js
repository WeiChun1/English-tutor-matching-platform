'use strict';
const faker = require('faker')
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let students = []
    students.push({
      name: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      nation: faker.address.country(),
      avatar: `https://xsgames.co/randomusers/assets/avatars/male/${Math.ceil(Math.random() * 50)}.jpg`,
      introdution: faker.lorem.paragraph(),
      learning_time: -999999,
      is_admin: 1,
      created_at: new Date(),
      updated_at: new Date()
    })
    for (let i = 0; i < 5; i++) {
      students.push({
        name: faker.name.findName(),
        email: `user${i + 1}@example.com`,
        password: await bcrypt.hash('12345678', 10),
        nation: faker.address.country(),
        avatar: `https://xsgames.co/randomusers/assets/avatars/male/${Math.ceil(Math.random() * 50)}.jpg`,
        introdution: faker.lorem.paragraph(),
        learning_time: Math.ceil(Math.random()*20),
        created_at: new Date(),
        updated_at: new Date()
      })
    }
    await queryInterface.bulkInsert('Students', students)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Students', {})
  }
};
