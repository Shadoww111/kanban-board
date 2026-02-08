const express = require("express");
const Comment = require("../models/Comment");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router({ mergeParams: true });
router.use(auth);

router.get("/", async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { cardId: req.params.cardId },
      include: [{ model: User, as: "author", attributes: ["id", "username", "avatar"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(comments);
  } catch { res.status(500).json({ msg: "error" }); }
});

router.post("/", async (req, res) => {
  try {
    if (!req.body.text?.trim()) return res.status(400).json({ msg: "text required" });
    const comment = await Comment.create({ text: req.body.text.trim(), cardId: req.params.cardId, userId: req.user.id });
    res.status(201).json(comment);
  } catch { res.status(500).json({ msg: "error" }); }
});

// TODO: edit + delete

module.exports = router;
