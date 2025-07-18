const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllCustomers, getCustomerByAccount } = require('../controllers/customersController');

router.get('/', auth, getAllCustomers);
router.get('/:account_number', auth, getCustomerByAccount);

module.exports = router; 