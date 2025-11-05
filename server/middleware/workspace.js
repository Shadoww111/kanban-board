const { WorkspaceMember } = require("../models/Workspace");

const requireMember = async (req, res, next) => {
  try {
    const workspaceId = req.params.workspaceId || req.body.workspaceId;
    if (!workspaceId) return res.status(400).json({ msg: "workspace id required" });
    const member = await WorkspaceMember.findOne({
      where: { workspaceId, userId: req.user.id },
    });
    if (!member) return res.status(403).json({ msg: "not a member" });
    req.membership = member;
    next();
  } catch { res.status(500).json({ msg: "error" }); }
};

const requireAdmin = async (req, res, next) => {
  if (!req.membership || !["owner", "admin"].includes(req.membership.role)) {
    return res.status(403).json({ msg: "admin required" });
  }
  next();
};

module.exports = { requireMember, requireAdmin };
