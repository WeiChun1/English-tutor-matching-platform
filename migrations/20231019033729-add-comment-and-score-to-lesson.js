'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Lessons', 'comment', {
      type: Sequelize.TEXT
    })
    await queryInterface.addColumn('Lessons', 'score', {
      type: Sequelize.INTEGER
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Lessons', 'comment')
    await queryInterface.removeColumn('Lessons', 'score')
  }
};
