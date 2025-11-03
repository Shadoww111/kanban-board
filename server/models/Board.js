const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Board = sequelize.define("Board", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  background: { type: DataTypes.STRING(50), defaultValue: "#6366f1" },
  workspaceId: { type: DataTypes.INTEGER, allowNull: false },
  createdBy: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: "boards" });

module.exports = Board;
