const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.config");

const UserModel = sequelize.define("User", {
    uuid: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
    },
}, {
    tableName: "users",
    timestamps: true,
    id: false,
});

module.exports = UserModel;