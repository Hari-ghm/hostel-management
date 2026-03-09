const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['General', 'Maintenance', 'Emergency', 'Event', 'Mess'],
    default: 'General'
  },
  priority: {
    type: String,
    enum: ['Low', 'Normal', 'High', 'Urgent'],
    default: 'Normal'
  },
  targetAudience: [{ 
    type: String, 
    enum: ['Student', 'Admin', 'Warden', 'Maintenance Staff', 'Mess Manager', 'All'],
    default: ['All']
  }],
  attachments: [{ type: String }],
  isPinned: { type: Boolean, default: false },
  validUntil: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
