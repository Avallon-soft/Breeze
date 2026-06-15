const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.config");

const Comment = sequelize.define("Comment", {
  comment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  comment_content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  comment_id_1: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "comments",
  timestamps: false
});

module.exports = Comment;