// src/app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('express').json;
const { sequelize } = require('./database/models'); // models/index.js must export Sequelize instance
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notFound = require("./middlewares/notFound");
const errorHandler = require('./middlewares/errorHandler');
const { authenticateToken } = require('./middlewares/auth');

const app = express();
app.use(bodyParser());

// register routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dashboard', authenticateToken, dashboardRoutes);

// ✅ if no route matches
app.use(notFound);

// ✅ global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 9000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');
    app.listen(PORT, () => console.log(`🚀 Server running http://localhost:${PORT}`));
  } catch (err) {
    console.error('DB connection failed', err);
  }
})();
