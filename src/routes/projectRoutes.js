const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.post("/", auth, role("admin"), async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.json(project);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find().populate("members");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/add-member", auth, role("admin"), async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    const project = await Project.findById(projectId);
    project.members.push(userId);
    await project.save();

    res.json(project);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;
