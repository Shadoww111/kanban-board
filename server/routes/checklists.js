const express = require("express");
const { Checklist, ChecklistItem } = require("../models/Checklist");
const auth = require("../middleware/auth");
const router = express.Router({ mergeParams: true });
router.use(auth);

// get checklists for a card
router.get("/", async (req, res) => {
  try {
    const lists = await Checklist.findAll({
      where: { cardId: req.params.cardId },
      include: [{ model: ChecklistItem, order: [["position", "ASC"]] }],
    });
    res.json(lists);
  } catch { res.status(500).json({ msg: "error" }); }
});

// create checklist
router.post("/", async (req, res) => {
  try {
    const cl = await Checklist.create({ title: req.body.title || "Checklist", cardId: req.params.cardId });
    res.status(201).json(cl);
  } catch { res.status(500).json({ msg: "error" }); }
});

// add item
router.post("/:clId/items", async (req, res) => {
  try {
    if (!req.body.text) return res.status(400).json({ msg: "text required" });
    const maxPos = await ChecklistItem.max("position", { where: { checklistId: req.params.clId } }) || 0;
    const item = await ChecklistItem.create({ text: req.body.text, position: maxPos + 1, checklistId: req.params.clId });
    res.status(201).json(item);
  } catch { res.status(500).json({ msg: "error" }); }
});

// toggle item
router.put("/items/:itemId", async (req, res) => {
  try {
    const item = await ChecklistItem.findByPk(req.params.itemId);
    if (!item) return res.status(404).json({ msg: "not found" });
    await item.update({ completed: !item.completed, text: req.body.text || item.text });
    res.json(item);
  } catch { res.status(500).json({ msg: "error" }); }
});

// delete item
router.delete("/items/:itemId", async (req, res) => {
  try {
    const item = await ChecklistItem.findByPk(req.params.itemId);
    if (!item) return res.status(404).json({ msg: "not found" });
    await item.destroy(); res.json({ msg: "deleted" });
  } catch { res.status(500).json({ msg: "error" }); }
});

// delete checklist
router.delete("/:clId", async (req, res) => {
  try {
    const cl = await Checklist.findByPk(req.params.clId);
    if (!cl) return res.status(404).json({ msg: "not found" });
    await cl.destroy(); res.json({ msg: "deleted" });
  } catch { res.status(500).json({ msg: "error" }); }
});

module.exports = router;
