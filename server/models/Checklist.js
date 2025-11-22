const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Card = require("./Card");

const Checklist = sequelize.define("Checklist", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(100), allowNull: false, defaultValue: "Checklist" },
  cardId: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: "checklists" });

const ChecklistItem = sequelize.define("ChecklistItem", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.STRING(200), allowNull: false },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
  position: { type: DataTypes.INTEGER, defaultValue: 0 },
  checklistId: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: "checklist_items" });

Card.hasMany(Checklist, { foreignKey: "cardId", onDelete: "CASCADE" });
Checklist.belongsTo(Card, { foreignKey: "cardId" });
Checklist.hasMany(ChecklistItem, { foreignKey: "checklistId", onDelete: "CASCADE" });
ChecklistItem.belongsTo(Checklist, { foreignKey: "checklistId" });

module.exports = { Checklist, ChecklistItem };
