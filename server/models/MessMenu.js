const mongoose = require('mongoose');

const messMenuSchema = new mongoose.Schema({
  day: { 
    type: String, 
    required: true, 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 
    unique: true 
  },
  meals: {
    breakfast: { type: String, required: true },
    lunch: { type: String, required: true },
    snacks: { type: String },
    dinner: { type: String, required: true }
  },
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('MessMenu', messMenuSchema);
