const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { makePayment, getPaymentHistory } = require('../controllers/paymentsController');
const { body } = require('express-validator');

router.post('/', auth, [
  body('account_number').notEmpty(),
  body('payment_amount').isNumeric()
], makePayment);

router.get('/:account_number', auth, getPaymentHistory);

module.exports = router; 