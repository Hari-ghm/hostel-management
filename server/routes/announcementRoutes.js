const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    const savedMsg = await announcement.save();
    res.status(201).json(savedMsg);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
