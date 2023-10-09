'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Lesson.belongsTo(models.Student, { foreignKey: 'studnetId' })
      Lesson.belongsTo(models.Teacher, { foreignKey: 'teacherId' })
    }
  };
  Lesson.init({
    startTime: DataTypes.DATE,
    usageTime: DataTypes.INTEGER,
    link: DataTypes.STRING,
    seleted: DataTypes.BOOLEAN,
    studnetId: DataTypes.INTEGER,
    teacherId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Lesson',
    modelTable: 'Lessons',
    underscored: true,
  });
  return Lesson;
};