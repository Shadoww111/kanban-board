const express = require("express");
const { body, validationResult } = require("express-validator");
const Board = require("../models/Board");
const Column = require("../models/Column");
const Card = require("../models/Card");
const { Label } = require("../models/Label");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { requireMember } = require("../middleware/workspace");
const router = express.Router({ mergeParams: true });
router.use(auth);

// list boards in workspace
router.get("/", requireMember, async (req, res) => {
  try {
    const boards = await Board.findAll({
      where: { workspaceId: req.params.workspaceId },
      include: [{ model: User, as: "creator", attributes: ["id", "username"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(boards);
  } catch (e) { res.status(500).json({ msg: "error" }); }
});

// create board
router.post("/", requireMember, [body("name").trim().isLength({ min: 1 })], async (req, res) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    const { name, description, background } = req.body;
    const board = await Board.create({
      name, description, background: background || "#6366f1",
      workspaceId: req.params.workspaceId, createdBy: req.user.id,
    });
    // create default columns
    await Column.bulkCreate([
      { name: "To Do", position: 0, boardId: board.id },
      { name: "In Progress", position: 1, boardId: board.id },
      { name: "Done", position: 2, boardId: board.id },
    ]);
    // default labels
    await Label.bulkCreate([
      { name: "bug", color: "#ef4444", boardId: board.id },
      { name: "feature", color: "#3b82f6", boardId: board.id },
      { name: "urgent", color: "#f59e0b", boardId: board.id },
    ]);
    res.status(201).json(board);
  } catch (e) { console.error(e); res.status(500).json({ msg: "error" }); }
});

// get board with all data
router.get("/:boardId", requireMember, async (req, res) => {
  try {
    const board = await Board.findOne({
      where: { id: req.params.boardId, workspaceId: req.params.workspaceId },
      include: [
        {
          model: Column, order: [["position", "ASC"]],
          include: [{
            model: Card, order: [["position", "ASC"]],
            include: [
              { model: Label, through: { attributes: [] } },
              { model: User, as: "assignee", attributes: ["id", "username", "avatar"] },
            ],
          }],
        },
        { model: Label },
        { model: User, as: "creator", attributes: ["id", "username"] },
      ],
      order: [[Column, "position", "ASC"], [Column, Card, "position", "ASC"]],
    });
    if (!board) return res.status(404).json({ msg: "not found" });
    res.json(board);
  } catch (e) { console.error(e); res.status(500).json({ msg: "error" }); }
});

// update board
router.put("/:boardId", requireMember, async (req, res) => {
  try {
    const board = await Board.findOne({ where: { id: req.params.boardId, workspaceId: req.params.workspaceId } });
    if (!board) return res.status(404).json({ msg: "not found" });
    const { name, description, background } = req.body;
    await board.update({
      name: name || board.name,
      description: description !== undefined ? description : board.description,
      background: background || board.background,
    });
    res.json(board);
  } catch (e) { res.status(500).json({ msg: "error" }); }
});

// delete board
router.delete("/:boardId", requireMember, async (req, res) => {
  try {
    const board = await Board.findOne({ where: { id: req.params.boardId, workspaceId: req.params.workspaceId } });
    if (!board) return res.status(404).json({ msg: "not found" });
    await board.destroy();
    res.json({ msg: "deleted" });
  } catch (e) { res.status(500).json({ msg: "error" }); }
});

module.exports = router;
