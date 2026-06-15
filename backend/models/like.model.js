const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.config");

const Like = sequelize.define("Like", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  post_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  like_: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: "likes",
  timestamps: false
});

module.exports = Like;