'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const teachers = await queryInterface.sequelize.query(
      'SELECT id FROM Teachers;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const students = await queryInterface.sequelize.query(
      'SELECT id FROM Students;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
