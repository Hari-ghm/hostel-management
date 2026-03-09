const mongoose = require('mongoose');

const laundrySchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestDate: { type: Date, default: Date.now },
  itemsCount: { type: Number, required: true },
  weightInKg: { type: Number },
  clothingTypes: [{
    type: String,
    enum: ['Shirt', 'T-Shirt', 'Pants/Jeans', 'Undergarments', 'Bedsheet', 'Towel', 'Other']
  }],
  specialInstructions: { type: String },
  status: { 
    type: String, 
    required: true, 
    enum: ['Pending', 'Collected', 'Washing', 'Ready for Pickup', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Staff ID
  expectedDelivery: { type: Date },
  actualDelivery: { type: Date },
  amount: { type: Number } // if specific pay-per-use, otherwise part of generic fee
}, { timestamps: true });

module.exports = mongoose.model('Laundry', laundrySchema);
