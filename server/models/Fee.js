const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feeType: { 
    type: String, 
    required: true, 
    enum: ['Hostel Fee', 'Mess Fee', 'Fine', 'Damage Fine', 'Laundry', 'Other'] 
  },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['Unpaid', 'Partial', 'Paid', 'Overdue'],
    default: 'Unpaid'
  },
  amountPaid: { type: Number, default: 0 },
  paymentHistory: [{
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    paymentMethod: { type: String, enum: ['Online', 'Cash', 'Bank Transfer', 'Cheque'] },
    transactionId: { type: String },
    receiptUrl: { type: String },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);
