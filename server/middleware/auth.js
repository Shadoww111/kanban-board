const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const header = req.header("Authorization");
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "no token" });
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ msg: "invalid token" });
    req.user = user;
    next();
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "token expired", expired: true });
    }
    res.status(401).json({ msg: "invalid token" });
  }
};
