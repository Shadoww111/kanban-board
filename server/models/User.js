const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const bcrypt = require("bcryptjs");

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING(255), allowNull: false },
  avatar: { type: DataTypes.STRING(10), defaultValue: "👤" },
}, {
  tableName: "users",
  hooks: {
    beforeCreate: async (u) => { u.password = await bcrypt.hash(u.password, 12); },
    beforeUpdate: async (u) => { if (u.changed("password")) u.password = await bcrypt.hash(u.password, 12); },
  },
});

User.prototype.checkPassword = async function (pw) {
  return bcrypt.compare(pw, this.password);
};

User.prototype.toJSON = function () {
  const v = { ...this.get() };
  delete v.password;
  return v;
};

module.exports = User;
