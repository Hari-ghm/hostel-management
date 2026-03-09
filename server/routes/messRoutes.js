const express = require('express');
const router = express.Router();
const MessMenu = require('../models/MessMenu');

router.get('/', async (req, res) => {
  try {
    const menus = await MessMenu.find().sort({ createdAt: -1 });
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const menu = new MessMenu(req.body);
    const savedMenu = await menu.save();
    res.status(201).json(savedMenu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
