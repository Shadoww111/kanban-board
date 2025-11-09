const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/db");

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "5mb" }));

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/workspaces", require("./routes/workspaces"));
app.use("/api/workspaces/:workspaceId/boards", require("./routes/boards"));
app.use("/api/boards/:boardId/columns", require("./routes/columns"));
app.use("/api/boards/:boardId/labels", require("./routes/labels"));
app.use("/api/cards", require("./routes/cards"));

app.get("/api/health", (_, res) => res.json({ status: "ok" }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "internal error" });
});

const PORT = process.env.PORT || 5000;
(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`api on :${PORT}`));
})();
