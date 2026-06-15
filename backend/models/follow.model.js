const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.config");

const Follow = sequelize.define("Follow", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  user_id_1: {
    type: DataTypes.INTEGER,
    primaryKey: true
  }
}, {
  tableName: "follow",
  timestamps: false
});

module.exports = Follow;