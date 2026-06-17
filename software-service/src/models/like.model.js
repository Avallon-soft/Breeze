const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.config");

const Like = sequelize.define("Like", {
  like_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  comment_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: "likes",
  timestamps: true
});

module.exports = Like;
