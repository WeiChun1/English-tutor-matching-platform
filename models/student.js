'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.hasMany(models.Lesson, { foreignKey: 'studnetId' })
    }
  };
  Student.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    introdution: DataTypes.TEXT,
    avatar: DataTypes.STRING,
    learningTime: DataTypes.INTEGER,
    nation: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Student',
    tableName: 'Students',
    underscored: true,
  });
  return Student;
};