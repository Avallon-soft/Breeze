const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.config");

const Follow = sequelize.define("Follow", {
  follower_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  following_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  }
}, {
  tableName: "follows",
  timestamps: true
});

module.exports = Follow;