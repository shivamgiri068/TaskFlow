const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

// GET /api/tasks - Get all tasks for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/tasks - Create task
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ msg: "Title is required" });
    }

    const newTask = await Task.create({
      title,
      description,
      status: status || "todo",
      priority: priority || "medium",
      dueDate,
      userId: req.user.id
    });

    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// PUT /api/tasks/:id - Update task (title, description, status, priority)
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    // Check if task exists and belongs to user
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ msg: "Task not found or unauthorized" });
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ msg: "Task not found or unauthorized" });
    }
    res.json({ msg: "Task deleted successfully" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;
