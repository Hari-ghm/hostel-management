const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  visitorName: { type: String, required: true },
  relationship: { type: String, required: true },
  contactNumber: { type: String, required: true },
  purpose: { type: String, required: true },
  hostelBlock: { type: mongoose.Schema.Types.ObjectId, ref: 'Block', required: true },
  
  // Timing details
  expectedEntry: { type: Date, required: true },
  expectedExit: { type: Date },
  actualEntry: { type: Date },
  actualExit: { type: Date },
  
  // Approval
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectionReason: { type: String },
  idProofUrl: { type: String } // Image/PDF of visitor ID
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);
