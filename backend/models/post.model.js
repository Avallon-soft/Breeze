const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.config");

const Post = sequelize.define("Post", {
  post_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  post_content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date_start: {
    type: DataTypes.DATE,
    allowNull: true
  },
  post_time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "posts",
  timestamps: false
});

module.exports = Post;