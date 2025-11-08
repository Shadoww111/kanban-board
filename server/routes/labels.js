const express = require("express");
const { Label } = require("../models/Label");
const auth = require("../middleware/auth");
const router = express.Router({ mergeParams: true });
router.use(auth);

router.get("/", async (req, res) => {
  try { res.json(await Label.findAll({ where: { boardId: req.params.boardId }, order: [["name", "ASC"]] })); }
  catch { res.status(500).json({ msg: "error" }); }
});

router.post("/", async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name) return res.status(400).json({ msg: "name required" });
    const label = await Label.create({ name, color: color || "#6366f1", boardId: req.params.boardId });
    res.status(201).json(label);
  } catch { res.status(500).json({ msg: "error" }); }
});

router.put("/:labelId", async (req, res) => {
  try {
    const label = await Label.findByPk(req.params.labelId);
    if (!label) return res.status(404).json({ msg: "not found" });
    await label.update({ name: req.body.name || label.name, color: req.body.color || label.color });
    res.json(label);
  } catch { res.status(500).json({ msg: "error" }); }
});

router.delete("/:labelId", async (req, res) => {
  try {
    const label = await Label.findByPk(req.params.labelId);
    if (!label) return res.status(404).json({ msg: "not found" });
    await label.destroy();
    res.json({ msg: "deleted" });
  } catch { res.status(500).json({ msg: "error" }); }
});

module.exports = router;
