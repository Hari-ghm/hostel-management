const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const complaintSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  category: {
    type: String,
    required: true,
    enum: ['maintenance', 'food', 'wifi', 'cleanliness', 'security', 'other']
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    required: true,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  images: [{ type: String }], // Array of image URLs
  resolutionNotes: { type: String },
  timeline: [{
    status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'] },
    notes: String,
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }]
}, { timestamps: true });

complaintSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Complaint', complaintSchema);
