const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');

router.get('/', async (req, res) => {
  try {
    const fees = await Fee.find().sort({ createdAt: -1 });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const fee = new Fee(req.body);
    const savedMsg = await fee.save();
    res.status(201).json(savedMsg);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id/pay', async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee not found' });
    
    fee.status = 'Paid';
    fee.amountPaid = fee.amount;
    fee.paymentHistory.push({
      amount: fee.amount,
      paymentMethod: req.body.method || 'Online',
      transactionId: req.body.transactionId || `TXN${Date.now()}`
    });
    
    await fee.save();
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
