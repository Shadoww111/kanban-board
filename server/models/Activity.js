const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");
const Card = require("./Card");

const Activity = sequelize.define("Activity", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  action: { type: DataTypes.STRING(50), allowNull: false },
  details: { type: DataTypes.TEXT, allowNull: true },
  cardId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: "activities", updatedAt: false });

Card.hasMany(Activity, { foreignKey: "cardId", onDelete: "CASCADE" });
Activity.belongsTo(Card, { foreignKey: "cardId" });
Activity.belongsTo(User, { foreignKey: "userId", as: "actor" });

module.exports = Activity;
