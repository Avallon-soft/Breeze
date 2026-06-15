const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.config");

const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  user_password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  user_avatar_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  id_language: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  id_type: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: "users",
  timestamps: false
});

module.exports = User;