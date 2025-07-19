const pool = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { account_number, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM customers WHERE account_number = ?', [account_number]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, account_number: user.account_number }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ id: user.id, account_number: user.account_number }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, refreshToken, user: { id: user.id, account_number: user.account_number } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }
  
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const [rows] = await pool.query('SELECT * FROM customers WHERE id = ?', [decoded.id]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    
    const user = rows[0];
    const newToken = jwt.sign({ id: user.id, account_number: user.account_number }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const newRefreshToken = jwt.sign({ id: user.id, account_number: user.account_number }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    res.json({ token: newToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
}; 