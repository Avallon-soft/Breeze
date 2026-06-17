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
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  parent_comment_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: "comments",
  timestamps: true
});

module.exports = Comment;