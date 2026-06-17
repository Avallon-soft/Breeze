const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.config");

const UserModel = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    user_bio: {
        type: DataTypes.TEXT,
        defaultValue: "",
    },
    user_avatar_url: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
    id_language: {
        type: DataTypes.INTEGER,
        defaultValue: null,
    },
    id_type: {
        type: DataTypes.INTEGER,
        defaultValue: null,
    },
}, {
    tableName: "users",
    timestamps: true,
});

module.exports = UserModel;
