require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/stats', require('./routes/statRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🏠 Server running on http://localhost:${PORT}`));
