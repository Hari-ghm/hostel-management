const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');

router.get('/', async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const visitor = new Visitor(req.body);
    const savedMsg = await visitor.save();
    res.status(201).json(savedMsg);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
