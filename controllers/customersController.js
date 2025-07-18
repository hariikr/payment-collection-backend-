const pool = require('../models/db');

exports.getAllCustomers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, account_number, issue_date, interest_rate, tenure, emi_due FROM customers');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCustomerByAccount = async (req, res) => {
  const { account_number } = req.params;
  try {
    const [rows] = await pool.query('SELECT id, account_number, issue_date, interest_rate, tenure, emi_due FROM customers WHERE account_number = ?', [account_number]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 