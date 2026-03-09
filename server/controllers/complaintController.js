const Complaint = require('../models/Complaint');

// @desc    Get all complaints
// @route   GET /api/complaints
const getComplaints = async (req, res) => {
  try {
    const { status, category, priority } = req.query;
    let query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    const complaints = await Complaint.find(query).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: 'Server Error', message: error.message });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ id: req.params.id });
    if (!complaint) return res.status(404).json({ error: 'Not found' });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: 'Server Error', message: error.message });
  }
};

// @desc    Create new complaint
// @route   POST /api/complaints
const createComplaint = async (req, res) => {
  const { studentName, roomNumber, category, title, description, priority } = req.body;
  
  if (!studentName || !roomNumber || !category || !title || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const complaint = await Complaint.create({
      studentName,
      roomNumber,
      category,
      title,
      description,
      priority: priority || 'medium',
      status: 'open',
    });
    
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update complaint
// @route   PATCH /api/complaints/:id
const updateComplaint = async (req, res) => {
  try {
    const allowed = ['status', 'priority', 'title', 'description'];
    let updateFields = {};
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updateFields[field] = req.body[field];
    });

    const complaint = await Complaint.findOneAndUpdate(
      { id: req.params.id },
      { $set: updateFields },
      { new: true } // Return updated document
    );

    if (!complaint) return res.status(404).json({ error: 'Not found' });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: 'Server Error', message: error.message });
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOneAndDelete({ id: req.params.id });
    if (!complaint) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', message: error.message });
  }
};

// @desc    Get stats
// @route   GET /api/stats
const getStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    
    // Group by status
    const statusCounts = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    let byStatus = { open: 0, 'in-progress': 0, resolved: 0 };
    statusCounts.forEach(s => {
      byStatus[s._id] = s.count;
    });

    // Group by category
    const categoryCounts = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    let byCategory = {};
    categoryCounts.forEach(c => {
      byCategory[c._id] = c.count;
    });

    res.json({ total, byStatus, byCategory });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', message: error.message });
  }
};

module.exports = {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint,
  getStats
};
