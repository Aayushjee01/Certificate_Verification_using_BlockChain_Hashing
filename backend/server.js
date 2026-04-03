const express = require('express');
const cors = require('cors');
require('dotenv').config();
const certificateRoutes = require('./routes/certificateRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Middleware setup
 */
app.use(cors({ origin: '*' })); // Permissive CORS for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

/**
 * Routes
 */
app.use('/api/certificates', certificateRoutes);
app.use('/api/auth', authRoutes);

/**
 * Basic Health Check Endpoint
 */
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: "Blockchain Certification Backend is running..." 
  });
});

/**
 * Global Error Handler for better JSON responses
 */
app.use((err, req, res, next) => {
  console.error("Global Error Handler Stack-Trace:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong on the server!",
    data: {}
  });
});

/**
 * Launch Server
 */
app.listen(PORT, () => {
  console.log(`[SERVER] Backend is active on port ${PORT}`);
  console.log(`[CONTRACT] Connecting to: ${process.env.CONTRACT_ADDRESS}`);
});
