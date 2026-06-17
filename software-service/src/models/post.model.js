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
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "posts",
  timestamps: true
});

module.exports = Post;