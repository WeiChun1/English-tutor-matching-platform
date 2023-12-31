'use strict';

const faker = require('faker')
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let teachers = []
    
    for(let i = 15; i < 40; i++){
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
    //我原始的方法是直接把學生id帶到teacher所以不會有重複問題
    //避免找資料時會有誤，所以我Teachers資料寫完刪掉再寫，這樣就不會有id重複的問題
    await queryInterface.bulkInsert('Teachers', teachers)
    await queryInterface.bulkDelete('Teachers', {})
    await queryInterface.bulkInsert('Teachers', teachers)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Teachers', {})
  }
};
