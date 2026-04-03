const express = require('express');
const cors = require('cors');
require('dotenv').config();
const certificateRoutes = require('./routes/certificateRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Middleware setup
 */
app.use(cors()); // Allow frontend to fetch data from different domains/ports
app.use(express.json()); // Universal JSON parsing for request bodies
app.use(express.urlencoded({ extended: true }));

/**
 * Routes
 */
app.use('/api/certificates', certificateRoutes);

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
