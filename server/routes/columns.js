const express = require("express");
const { body } = require("express-validator");
const Column = require("../models/Column");
const Board = require("../models/Board");
const auth = require("../middleware/auth");
const router = express.Router({ mergeParams: true });
router.use(auth);

router.post("/", [body("name").trim().isLength({ min: 1 })], async (req, res) => {
  try {
    const board = await Board.findByPk(req.params.boardId);
    if (!board) return res.status(404).json({ msg: "board not found" });
    const maxPos = await Column.max("position", { where: { boardId: board.id } }) || 0;
    const col = await Column.create({ name: req.body.name, position: maxPos + 1, boardId: board.id });
    res.status(201).json(col);
  } catch (e) { res.status(500).json({ msg: "error" }); }
});

router.put("/:colId", async (req, res) => {
  try {
    const col = await Column.findByPk(req.params.colId);
    if (!col) return res.status(404).json({ msg: "not found" });
    if (req.body.name) col.name = req.body.name;
    await col.save(); res.json(col);
  } catch (e) { res.status(500).json({ msg: "error" }); }
});

router.put("/", async (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) return res.status(400).json({ msg: "order array required" });
    for (const item of order) {
      await Column.update({ position: item.position }, { where: { id: item.id } });
    }
    res.json({ msg: "reordered" });
  } catch (e) { res.status(500).json({ msg: "error" }); }
});

// fix: reorder remaining columns after delete to avoid gaps
router.delete("/:colId", async (req, res) => {
  try {
    const col = await Column.findByPk(req.params.colId);
    if (!col) return res.status(404).json({ msg: "not found" });
    const boardId = col.boardId;
    const pos = col.position;
    await col.destroy();
    // close the gap
    const remaining = await Column.findAll({ where: { boardId }, order: [["position", "ASC"]] });
    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].position !== i) {
        await remaining[i].update({ position: i });
      }
    }
    res.json({ msg: "deleted" });
  } catch (e) { res.status(500).json({ msg: "error" }); }
});

module.exports = router;
