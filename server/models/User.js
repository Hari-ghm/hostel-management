const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['Student', 'Admin', 'Warden', 'Maintenance Staff', 'Mess Manager'],
    default: 'Student'
  },
  contactNumber: { type: String },
  profileImage: { type: String }, // URL to image
  
  // Student specific fields
  registrationNumber: { type: String },
  course: { type: String },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  hostelBlock: { type: mongoose.Schema.Types.ObjectId, ref: 'Block' },
  guardianName: { type: String },
  guardianContact: { type: String },
  
  // Staff specific fields
  employeeId: { type: String },
  designation: { type: String },
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
