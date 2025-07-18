require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('./models/db');

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const paymentRoutes = require('./routes/payments');

app.use('/auth', authRoutes);
app.use('/customers', customerRoutes);
app.use('/payments', paymentRoutes);

// Check database connection on startup
pool.getConnection()
  .then(conn => {
    console.log('Database connected');
    conn.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err.message);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 