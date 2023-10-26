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
    for (let i = 15; i < 35; i++) {
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
    //我原始的方法是直接把學生id帶到teacher所以不會有重複問題
    //避免找資料時會有誤，所以我Students資料寫完刪掉再寫，這樣就不會有id重複的問題
    await queryInterface.bulkInsert('Students', students)
    await queryInterface.bulkDelete('Students', {})
    await queryInterface.bulkInsert('Students', students)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Students', {})
  }
};
