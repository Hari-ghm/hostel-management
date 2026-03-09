const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find().populate('block');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const room = new Room(req.body);
    const savedRoom = await room.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id/allocate', async (req, res) => {
  try {
    const { studentId } = req.body;
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (room.occupants.length >= room.capacity) return res.status(400).json({ message: 'Room is already full' });
    
    // Check if student already in room
    if (room.occupants.includes(studentId)) {
      return res.status(400).json({ message: 'Student already in this room' });
    }
    
    room.occupants.push(studentId);
    if (room.occupants.length >= room.capacity) {
      room.status = 'Full';
    }
    await room.save();
    
    // Also update student's room
    const User = require('../models/User');
    await User.findByIdAndUpdate(studentId, { room: room._id });
    
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
