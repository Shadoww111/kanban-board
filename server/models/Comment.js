const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");
const Card = require("./Card");

const Comment = sequelize.define("Comment", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.TEXT, allowNull: false },
  cardId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: "comments" });

Card.hasMany(Comment, { foreignKey: "cardId", onDelete: "CASCADE" });
Comment.belongsTo(Card, { foreignKey: "cardId" });
Comment.belongsTo(User, { foreignKey: "userId", as: "author" });

module.exports = Comment;
