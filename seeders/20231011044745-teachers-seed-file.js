'use strict';

const faker = require('faker')
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let teachers = []
    let lessons = []
    for(let i = 0; i < 15; i++){
      let days = []
      teachers.push({
        name: `user${i + 6}`,
        email: `user${i + 6}@example.com`,
        password: await bcrypt.hash('12345678', 10),
        nation: faker.address.country(),
        avatar: faker.image.avatar(),
        teach_style: faker.lorem.text(),
        introdution: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date()
      })
    }
    await queryInterface.bulkInsert('Teachers', teachers)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Teachers', {})
  }
};
