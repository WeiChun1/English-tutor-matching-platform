'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Teachers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      introdution: {
        type: Sequelize.TEXT
      },
      avatar: {
        type: Sequelize.STRING
      },
      nation: {
        type: Sequelize.STRING
      },
      teach_style: {
        type: Sequelize.TEXT
      },
      avg_score: {
        type: Sequelize.INTEGER
      },
      created_at: {
        defaultValue:0,
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Teachers');
  }
}