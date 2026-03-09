const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  warden: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalFloors: { type: Number, required: true },
  capacity: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Block', blockSchema);
