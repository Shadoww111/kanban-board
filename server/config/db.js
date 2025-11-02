const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mariadb",
    logging: false,
    pool: { max: 10, min: 2, acquire: 30000, idle: 10000 },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("db connected");
    await sequelize.sync({ alter: false });
  } catch (e) {
    console.error("db failed:", e.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
