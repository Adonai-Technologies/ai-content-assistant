const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Permit } = require("permitio");
const OpenAI = require("openai");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Permit SDK init
const permit = new Permit({
  token: process.env.PERMIT_API_KEY,
  pdp: "https://cloudpdp.api.permit.io",
});

// OpenAI init (using v4.x)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory storage
const summaries = [];
let idCounter = 1;

// --- Auth ---
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  const users = {
    admin: { password: "2025DEVChallenge", role: "admin" },
    newuser: { password: "2025DEVChallenge", role: "user" },
  };

  const user = users[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({ username, role: user.role });
});

// --- Submit Summary ---
app.post("/ai/summarize", async (req, res) => {
  const { content, user } = req.body;

  if (!content || !user) {
    return res.status(400).json({ error: "Missing content or user" });
  }

  try {
    const allowed = await permit.check(user, "summarize", "content");
    if (!allowed) return res.status(403).json({ error: "Not authorized to summarize content" });

    // --- Mocking AI summary instead of real API call
    const summary = `Summary (mocked): ${content.slice(0, 100)}...`;

    const newSummary = {
      id: idCounter++,
      content,
      summary,
      author: user,
      status: "pending",
    };

    summaries.push(newSummary);
    res.json({ message: "Summary submitted for review", summary: newSummary });
  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ error: "AI summarization failed" });
  }
});

// --- Get pending summaries for review ---
app.get("/review", async (req, res) => {
  const { user } = req.query;

  const allowed = await permit.check(user, "review", "content");
  if (!allowed) {
    return res.status(403).json({ error: "Not authorized to review content" });
  }

  const pendingSummaries = summaries.filter((s) => s.status === "pending");
  res.json(pendingSummaries);
});

// --- Review (approve/reject) a summary ---
app.post("/review/:id", async (req, res) => {
  const { user, action } = req.body;
  const { id } = req.params;

  const allowed = await permit.check(user, "review", "content");
  if (!allowed) {
    return res.status(403).json({ error: "Not authorized to review content" });
  }

  const summary = summaries.find((s) => s.id === parseInt(id));
  if (!summary) return res.status(404).json({ error: "Summary not found" });

  if (!["approved", "rejected"].includes(action)) {
    return res.status(400).json({ error: "Invalid action" });
  }

  summary.status = action;
  res.json({ message: `Summary ${action}` });
});

// --- Get published summaries ---
app.get("/published", async (req, res) => {
  const { user } = req.query;

  const allowed = await permit.check(user, "view", "content");
  if (!allowed) {
    return res.status(403).json({ error: "Not authorized to view published content" });
  }

  const published = summaries.filter((s) => s.status === "approved");
  res.json(published);
});

app.listen(3001, () => console.log("✅ Backend running on http://localhost:3001"));
