require("dotenv").config();

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME || "authdb",
    process.env.DB_USER || "postgres",
    process.env.DB_PASSWORD || "postgres",
    {
        host: process.env.DB_HOST || "auth-postgres",
        port: process.env.DB_PORT || 5432,
        dialect: "postgres",
        logging: false,
    }
);

module.exports = sequelize;