const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/complaintController');

router.route('/')
  .get(getStats);

module.exports = router;
