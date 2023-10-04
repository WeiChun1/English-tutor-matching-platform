'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Teacher.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    introdution: DataTypes.TEXT,
    avatar: DataTypes.STRING,
    nation: DataTypes.STRING,
    teach_style: DataTypes.TEXT,
    avg_score: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Teacher',
    tableName: 'Teachers',
    underscored: true,
  });
  return Teacher;
};