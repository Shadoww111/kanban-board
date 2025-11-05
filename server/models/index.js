const User = require("./User");
const { Workspace, WorkspaceMember } = require("./Workspace");
const Board = require("./Board");
const Column = require("./Column");
const Card = require("./Card");
const { Label, CardLabel } = require("./Label");

// User <-> Workspace (through WorkspaceMember)
User.belongsToMany(Workspace, { through: WorkspaceMember, foreignKey: "userId" });
Workspace.belongsToMany(User, { through: WorkspaceMember, foreignKey: "workspaceId", as: "members" });
Workspace.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// Workspace -> Board
Workspace.hasMany(Board, { foreignKey: "workspaceId", onDelete: "CASCADE" });
Board.belongsTo(Workspace, { foreignKey: "workspaceId" });
Board.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

// Board -> Column
Board.hasMany(Column, { foreignKey: "boardId", onDelete: "CASCADE" });
Column.belongsTo(Board, { foreignKey: "boardId" });

// Column -> Card
Column.hasMany(Card, { foreignKey: "columnId", onDelete: "CASCADE" });
Card.belongsTo(Column, { foreignKey: "columnId" });
Card.belongsTo(User, { foreignKey: "assigneeId", as: "assignee" });
Card.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

// Card <-> Label (many-to-many)
Card.belongsToMany(Label, { through: CardLabel, foreignKey: "cardId" });
Label.belongsToMany(Card, { through: CardLabel, foreignKey: "labelId" });
Board.hasMany(Label, { foreignKey: "boardId", onDelete: "CASCADE" });
Label.belongsTo(Board, { foreignKey: "boardId" });

module.exports = { User, Workspace, WorkspaceMember, Board, Column, Card, Label, CardLabel };
