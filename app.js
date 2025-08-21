// app.js
require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const app = express();
app.use(express.json());

// ====== ENV CONFIG ======
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "secret123";
const NEWS_API_KEY = process.env.NEWS_API_KEY || "your_api_key";

// ====== IN-MEMORY DATA STORES ======
let users = [];
let tasks = [
  {
    id: 1,
    title: "Set up environment",
    description: "Install Node.js, npm, and git",
    completed: true,
  },
];
let nextTaskId = 2;

// ====== AUTH MIDDLEWARE ======
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

// ====== USER AUTH ======
// Register
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
  if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: users.length + 1, email, password: hashedPassword, preferences: {} };
  users.push(newUser);
  res.status(201).json({ message: "User registered successfully" });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// ====== USER PREFERENCES ======
app.get("/preferences", authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  res.json(user.preferences || {});
});

app.put("/preferences", authenticateToken, (req, res) => {
  const { categories, language } = req.body;
  const user = users.find(u => u.id === req.user.id);

  user.preferences = { categories, language };
  res.json({ message: "Preferences updated", preferences: user.preferences });
});

// ====== NEWS FETCHING ======
app.get("/news", authenticateToken, async (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  const { categories = "technology", language = "en" } = user.preferences || {};

  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: { category: categories, language, apiKey: NEWS_API_KEY },
    });
    res.json(response.data.articles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// ====== TASK CRUD ======
// Create Task
app.post("/tasks", (req, res) => {
  const { title, description, completed } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  const newTask = {
    id: nextTaskId++,
    title,
    description,
    completed: completed || false,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Get All Tasks
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

// Get Task by ID
app.get("/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.status(200).json(task);
});

// Update Task
// Update task
app.put("/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });

  const { title, description, completed } = req.body;

  // ✅ Validation: title and description must exist
  if (!title || !description || typeof completed !== "boolean") {
    return res.status(400).json({ error: "Invalid data. Title, description, and completed(boolean) are required." });
  }

  task.title = title;
  task.description = description;
  task.completed = completed;
  res.status(200).json(task);
});


// Delete Task
app.delete("/tasks/:id", (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (taskIndex === -1) return res.status(404).json({ error: "Task not found" });

  const deletedTask = tasks.splice(taskIndex, 1);
  res.status(200).json(deletedTask[0]);
});

// ====== START SERVER ======
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
