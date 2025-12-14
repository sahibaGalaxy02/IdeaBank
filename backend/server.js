require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();

// CORS
app.use(cors({
  origin: 'https://idea-bank-gamma.vercel.app',
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ideas', require('./routes/ideas'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/ratings', require('./routes/ratings'));
// app.use('/api/users', require('./routes/users'));

// 404
app.use('*', (req, res) => res.status(404).json({ message: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;