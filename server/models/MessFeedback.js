const mongoose = require('mongoose');

const messFeedbackSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mealType: { 
    type: String, 
    required: true, 
    enum: ['breakfast', 'lunch', 'snacks', 'dinner', 'overall'] 
  },
  date: { type: Date, default: Date.now },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  status: { type: String, enum: ['Open', 'Reviewed', 'Resolved'], default: 'Open' }
}, { timestamps: true });

module.exports = mongoose.model('MessFeedback', messFeedbackSchema);
