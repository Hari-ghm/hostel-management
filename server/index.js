const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// ── In-memory store (swap with DB anytime) ──────────────────────────────────
let complaints = [
  {
    id: uuidv4(),
    studentName: 'Arjun Mehta',
    roomNumber: '204',
    category: 'maintenance',
    title: 'Broken ceiling fan',
    description: 'The fan in my room has stopped working. Its been 3 days.',
    status: 'open',
    priority: 'high',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: uuidv4(),
    studentName: 'Priya Sharma',
    roomNumber: '112',
    category: 'food',
    title: 'Cold meals being served',
    description: 'Dinner has been cold for the past week. Please look into this.',
    status: 'in-progress',
    priority: 'medium',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ── Routes ──────────────────────────────────────────────────────────────────

// GET all complaints (with optional filters)
app.get('/api/complaints', (req, res) => {
  let result = [...complaints];
  const { status, category, priority } = req.query;
  if (status)   result = result.filter(c => c.status === status);
  if (category) result = result.filter(c => c.category === category);
  if (priority) result = result.filter(c => c.priority === priority);
  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(result);
});

// GET single complaint
app.get('/api/complaints/:id', (req, res) => {
  const complaint = complaints.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Not found' });
  res.json(complaint);
});

// POST create complaint
app.post('/api/complaints', (req, res) => {
  const { studentName, roomNumber, category, title, description, priority } = req.body;
  if (!studentName || !roomNumber || !category || !title || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const complaint = {
    id: uuidv4(),
    studentName,
    roomNumber,
    category,
    title,
    description,
    priority: priority || 'medium',
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  complaints.push(complaint);
  res.status(201).json(complaint);
});

// PATCH update status / priority
app.patch('/api/complaints/:id', (req, res) => {
  const idx = complaints.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const allowed = ['status', 'priority', 'title', 'description'];
  allowed.forEach(field => {
    if (req.body[field] !== undefined) complaints[idx][field] = req.body[field];
  });
  complaints[idx].updatedAt = new Date().toISOString();
  res.json(complaints[idx]);
});

// DELETE complaint
app.delete('/api/complaints/:id', (req, res) => {
  const before = complaints.length;
  complaints = complaints.filter(c => c.id !== req.params.id);
  if (complaints.length === before) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

// GET stats
app.get('/api/stats', (req, res) => {
  const total = complaints.length;
  const byStatus = {
    open: complaints.filter(c => c.status === 'open').length,
    'in-progress': complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };
  const byCategory = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});
  res.json({ total, byStatus, byCategory });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🏠 Server running on http://localhost:${PORT}`));
