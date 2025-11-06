const express = require("express");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

const mkToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/register", [
  body("username").trim().isLength({ min: 3, max: 50 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
], async (req, res) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    const { username, email, password } = req.body;
    if (await User.findOne({ where: { email } })) return res.status(400).json({ msg: "email taken" });
    if (await User.findOne({ where: { username } })) return res.status(400).json({ msg: "username taken" });
    const user = await User.create({ username, email, password });
    res.status(201).json({ token: mkToken(user.id), user });
  } catch (e) { console.error(e); res.status(500).json({ msg: "server error" }); }
});

router.post("/login", [
  body("email").isEmail(),
  body("password").notEmpty(),
], async (req, res) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user || !(await user.checkPassword(req.body.password))) {
      return res.status(400).json({ msg: "invalid credentials" });
    }
    res.json({ token: mkToken(user.id), user });
  } catch (e) { console.error(e); res.status(500).json({ msg: "server error" }); }
});

router.get("/me", auth, (req, res) => res.json(req.user));

router.put("/me", auth, async (req, res) => {
  try {
    const { username, avatar } = req.body;
    if (username) req.user.username = username;
    if (avatar) req.user.avatar = avatar;
    await req.user.save();
    res.json(req.user);
  } catch (e) { res.status(500).json({ msg: "error" }); }
});

module.exports = router;
