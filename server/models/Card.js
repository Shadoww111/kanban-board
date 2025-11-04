const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Card = sequelize.define("Card", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  priority: { type: DataTypes.ENUM("none", "low", "medium", "high", "urgent"), defaultValue: "none" },
  dueDate: { type: DataTypes.DATEONLY, allowNull: true },
  columnId: { type: DataTypes.INTEGER, allowNull: false },
  assigneeId: { type: DataTypes.INTEGER, allowNull: true },
  createdBy: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: "cards" });

module.exports = Card;
