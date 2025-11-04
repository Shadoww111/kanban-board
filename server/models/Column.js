const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Column = sequelize.define("Column", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(50), allowNull: false },
  position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  boardId: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: "columns" });

module.exports = Column;
