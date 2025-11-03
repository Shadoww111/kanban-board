const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Workspace = sequelize.define("Workspace", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  slug: { type: DataTypes.STRING(120), allowNull: false, unique: true },
  ownerId: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: "workspaces" });

const WorkspaceMember = sequelize.define("WorkspaceMember", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  role: { type: DataTypes.ENUM("owner", "admin", "member"), defaultValue: "member" },
}, { tableName: "workspace_members" });

module.exports = { Workspace, WorkspaceMember };
