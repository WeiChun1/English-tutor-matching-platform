'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Teachers', 'comment_amount', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Teachers', 'comment_amount')
  }
};
