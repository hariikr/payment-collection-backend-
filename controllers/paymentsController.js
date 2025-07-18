const pool = require('../models/db');
const { validationResult } = require('express-validator');

exports.makePayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { account_number, payment_amount } = req.body;
  try {
    const [customers] = await pool.query('SELECT id, emi_due FROM customers WHERE account_number = ?', [account_number]);
    if (customers.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    const customer = customers[0];
    if (payment_amount > customer.emi_due) {
      await pool.query('INSERT INTO payments (customer_id, payment_amount, status) VALUES (?, ?, ?)', [customer.id, payment_amount, 'FAILED']);
      return res.status(400).json({ message: 'Payment failed: Amount exceeds EMI due.' });
    }
    if (payment_amount <= 0) {
      await pool.query('INSERT INTO payments (customer_id, payment_amount, status) VALUES (?, ?, ?)', [customer.id, payment_amount, 'FAILED']);
      return res.status(400).json({ message: 'Payment failed: Enter a valid amount.' });
    }
    await pool.query('INSERT INTO payments (customer_id, payment_amount, status) VALUES (?, ?, ?)', [customer.id, payment_amount, 'SUCCESS']);
    await pool.query('UPDATE customers SET emi_due = emi_due - ? WHERE id = ?', [payment_amount, customer.id]);
    res.json({ message: 'Payment successful' });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPaymentHistory = async (req, res) => {
  const { account_number } = req.params;
  try {
    const [customers] = await pool.query('SELECT id FROM customers WHERE account_number = ?', [account_number]);
    if (customers.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    const customer_id = customers[0].id;
    const [payments] = await pool.query('SELECT id, payment_date, payment_amount, status FROM payments WHERE customer_id = ? ORDER BY payment_date DESC', [customer_id]);
    res.json(payments);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: 'Server error' });
  }
}; 