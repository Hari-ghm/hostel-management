const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hostelBlock: { type: mongoose.Schema.Types.ObjectId, ref: 'Block' },
  status: { 
    type: String, 
    required: true, 
    enum: ['Present', 'Absent', 'On Leave'],
    default: 'Present'
  },
  date: { type: Date, default: Date.now },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  leaveRequest: {
    startDate: { type: Date },
    endDate: { type: Date },
    reason: { type: String },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'] }
  }
}, { timestamps: true });

// Prevent duplicate attendance for same student on same day
attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
