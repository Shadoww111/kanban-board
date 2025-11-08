const express = require("express");
const { body, validationResult } = require("express-validator");
const Card = require("../models/Card");
const Column = require("../models/Column");
const { Label, CardLabel } = require("../models/Label");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router({ mergeParams: true });
router.use(auth);

// create card
router.post("/", [body("title").trim().isLength({ min: 1 })], async (req, res) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    const col = await Column.findByPk(req.params.colId || req.body.columnId);
    if (!col) return res.status(404).json({ msg: "column not found" });
    const maxPos = await Card.max("position", { where: { columnId: col.id } }) || 0;
    const card = await Card.create({
      title: req.body.title, description: req.body.description,
      position: maxPos + 1, priority: req.body.priority || "none",
      dueDate: req.body.dueDate, columnId: col.id, createdBy: req.user.id,
    });
    res.status(201).json(card);
  } catch (e) { console.error(e); res.status(500).json({ msg: "error" }); }
});

// get card details
router.get("/:cardId", async (req, res) => {
  try {
    const card = await Card.findByPk(req.params.cardId, {
      include: [
        { model: Label, through: { attributes: [] } },
        { model: User, as: "assignee", attributes: ["id", "username", "avatar"] },
        { model: User, as: "creator", attributes: ["id", "username"] },
        { model: Column, attributes: ["id", "name"] },
      ],
    });
    if (!card) return res.status(404).json({ msg: "not found" });
    res.json(card);
  } catch (e) { res.status(500).json({ msg: "error" }); }
});

// update card
router.put("/:cardId", async (req, res) => {
  try {
    const card = await Card.findByPk(req.params.cardId);
    if (!card) return res.status(404).json({ msg: "not found" });
    const { title, description, priority, dueDate, assigneeId } = req.body;
    await card.update({
      title: title || card.title,
      description: description !== undefined ? description : card.description,
      priority: priority || card.priority,
      dueDate: dueDate !== undefined ? dueDate : card.dueDate,
      assigneeId: assigneeId !== undefined ? assigneeId : card.assigneeId,
    });
    res.json(card);
  } catch (e) { res.status(500).json({ msg: "error" }); }
});

// move card (change column + position)
router.put("/:cardId/move", async (req, res) => {
  try {
    const card = await Card.findByPk(req.params.cardId);
    if (!card) return res.status(404).json({ msg: "not found" });
    const { columnId, position } = req.body;
    if (columnId) card.columnId = columnId;
    if (position !== undefined) card.position = position;
    await card.save();
    res.json(card);
  } catch (e) { res.status(500).json({ msg: "error" }); }
});

// toggle label on card
router.post("/:cardId/labels/:labelId", async (req, res) => {
  try {
    const existing = await CardLabel.findOne({ where: { cardId: req.params.cardId, labelId: req.params.labelId } });
    if (existing) { await existing.destroy(); return res.json({ msg: "removed" }); }
    await CardLabel.create({ cardId: req.params.cardId, labelId: req.params.labelId });
    res.json({ msg: "added" });
  } catch (e) { res.status(500).json({ msg: "error" }); }
});

// delete card
router.delete("/:cardId", async (req, res) => {
  try {
    const card = await Card.findByPk(req.params.cardId);
    if (!card) return res.status(404).json({ msg: "not found" });
    await card.destroy();
    res.json({ msg: "deleted" });
  } catch (e) { res.status(500).json({ msg: "error" }); }
});

module.exports = router;
