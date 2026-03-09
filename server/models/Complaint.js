const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const complaintSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['maintenance', 'food', 'wifi', 'cleanliness', 'security', 'other'],
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      required: true,
      enum: ['open', 'in-progress', 'resolved'],
      default: 'open',
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Transform JSON response to match existing frontend expectations
complaintSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
