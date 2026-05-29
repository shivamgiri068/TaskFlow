const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.json(task);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(task);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Task deleted" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;
