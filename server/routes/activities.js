const express = require("express");
const Activity = require("../models/Activity");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router({ mergeParams: true });
router.use(auth);

// list activity for a card
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.findAll({
      where: { cardId: req.params.cardId },
      include: [{ model: User, as: "actor", attributes: ["id", "username", "avatar"] }],
      order: [["createdAt", "DESC"]],
      limit: 50,
    });
    res.json(activities);
  } catch { res.status(500).json({ msg: "error" }); }
});

// helper to log activity (used by other routes)
const logActivity = async (cardId, userId, action, details) => {
  try { await Activity.create({ cardId, userId, action, details }); }
  catch (e) { console.error("activity log error:", e.message); }
};

module.exports = router;
module.exports.logActivity = logActivity;
