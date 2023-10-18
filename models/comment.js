'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models.Student, { foreignKey: 'studentId' })
      Comment.belongsTo(models.Teacher, { foreignKey: 'teacherId' })
    }
  };
  Comment.init({
    content: DataTypes.TEXT,
    teacherId: DataTypes.INTEGER,
    studentId: DataTypes.INTEGER,
    score: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'Comments',
    underscored: true,
  });
  return Comment;
};