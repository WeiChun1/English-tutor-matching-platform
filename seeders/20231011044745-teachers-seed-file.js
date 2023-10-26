'use strict';

const faker = require('faker')
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let teachers = []
    
    for(let i = 0; i < 15; i++){
      teachers.push({
        name: faker.name.findName(),
        email: `user${i + 1}@example.com`,
        password: await bcrypt.hash('12345678', 10),
        nation: faker.address.country(),
        avatar: `https://xsgames.co/randomusers/assets/avatars/male/${Math.ceil(Math.random() * 50)}.jpg`,
        teach_style: faker.lorem.paragraph(),
        introdution: faker.lorem.paragraph(),
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
