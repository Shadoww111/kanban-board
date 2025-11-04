const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Label = sequelize.define("Label", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(30), allowNull: false },
  color: { type: DataTypes.STRING(7), allowNull: false, defaultValue: "#6366f1" },
  boardId: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: "labels" });

const CardLabel = sequelize.define("CardLabel", {}, { tableName: "card_labels", timestamps: false });

module.exports = { Label, CardLabel };
