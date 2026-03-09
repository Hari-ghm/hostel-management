const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  block: { type: mongoose.Schema.Types.ObjectId, ref: 'Block', required: true },
  floor: { type: Number, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['1-Seater', '2-Seater', '3-Seater', '4-Seater Dorm'] 
  },
  amenities: {
    hasAC: { type: Boolean, default: false },
    hasAttachedBath: { type: Boolean, default: false }
  },
  capacity: { type: Number, required: true },
  occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { 
    type: String, 
    enum: ['Available', 'Full', 'Maintenance'], 
    default: 'Available' 
  }
}, { timestamps: true });

// Ensure unique room numbers per block
roomSchema.index({ roomNumber: 1, block: 1 }, { unique: true });

module.exports = mongoose.model('Room', roomSchema);
