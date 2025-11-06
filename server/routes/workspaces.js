const express = require("express");
const { body, validationResult } = require("express-validator");
const slug = require("slug");
const { Workspace, WorkspaceMember } = require("../models/Workspace");
const User = require("../models/User");
const Board = require("../models/Board");
const auth = require("../middleware/auth");
const { requireMember, requireAdmin } = require("../middleware/workspace");
const router = express.Router();
router.use(auth);

// list user workspaces
router.get("/", async (req, res) => {
  try {
    const workspaces = await Workspace.findAll({
      include: [
        { model: User, through: { where: { userId: req.user.id } } },
        { model: User, as: "owner", attributes: ["id", "username", "avatar"] },
      ],
    });
    // filter to only those user is member of
    const userWs = [];
    for (const ws of workspaces) {
      const member = await WorkspaceMember.findOne({ where: { workspaceId: ws.id, userId: req.user.id } });
      if (member) userWs.push(ws);
    }
    res.json(userWs);
  } catch (e) { console.error(e); res.status(500).json({ msg: "error" }); }
});

// create workspace
router.post("/", [body("name").trim().isLength({ min: 1, max: 100 })], async (req, res) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    const { name, description } = req.body;
    const wsSlug = slug(name) + "-" + Date.now().toString(36);
    const ws = await Workspace.create({ name, description, slug: wsSlug, ownerId: req.user.id });
    await WorkspaceMember.create({ workspaceId: ws.id, userId: req.user.id, role: "owner" });
    res.status(201).json(ws);
  } catch (e) { console.error(e); res.status(500).json({ msg: "error" }); }
});

// get workspace
router.get("/:workspaceId", requireMember, async (req, res) => {
  try {
    const ws = await Workspace.findByPk(req.params.workspaceId, {
      include: [
        { model: User, as: "members", attributes: ["id", "username", "avatar"], through: { attributes: ["role"] } },
        { model: Board, attributes: ["id", "name", "background"] },
      ],
    });
    if (!ws) return res.status(404).json({ msg: "not found" });
    res.json(ws);
  } catch (e) { console.error(e); res.status(500).json({ msg: "error" }); }
});

// update workspace
router.put("/:workspaceId", requireMember, requireAdmin, async (req, res) => {
  try {
    const ws = await Workspace.findByPk(req.params.workspaceId);
    if (!ws) return res.status(404).json({ msg: "not found" });
    const { name, description } = req.body;
    await ws.update({ name: name || ws.name, description: description !== undefined ? description : ws.description });
    res.json(ws);
  } catch (e) { res.status(500).json({ msg: "error" }); }
});

// delete workspace
router.delete("/:workspaceId", requireMember, requireAdmin, async (req, res) => {
  try {
    const ws = await Workspace.findByPk(req.params.workspaceId);
    if (!ws) return res.status(404).json({ msg: "not found" });
    if (ws.ownerId !== req.user.id) return res.status(403).json({ msg: "only owner can delete" });
    await ws.destroy();
    res.json({ msg: "deleted" });
  } catch (e) { res.status(500).json({ msg: "error" }); }
});

// add member
router.post("/:workspaceId/members", requireMember, requireAdmin, async (req, res) => {
  try {
    const { email, role } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ msg: "user not found" });
    const exists = await WorkspaceMember.findOne({ where: { workspaceId: req.params.workspaceId, userId: user.id } });
    if (exists) return res.status(400).json({ msg: "already a member" });
    await WorkspaceMember.create({ workspaceId: req.params.workspaceId, userId: user.id, role: role || "member" });
    res.status(201).json({ msg: "added" });
  } catch (e) { res.status(500).json({ msg: "error" }); }
});

// remove member
router.delete("/:workspaceId/members/:userId", requireMember, requireAdmin, async (req, res) => {
  try {
    const member = await WorkspaceMember.findOne({ where: { workspaceId: req.params.workspaceId, userId: req.params.userId } });
    if (!member) return res.status(404).json({ msg: "not found" });
    if (member.role === "owner") return res.status(400).json({ msg: "cant remove owner" });
    await member.destroy();
    res.json({ msg: "removed" });
  } catch (e) { res.status(500).json({ msg: "error" }); }
});

module.exports = router;
