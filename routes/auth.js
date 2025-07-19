const express = require('express');
const router = express.Router();
const { login, refreshToken } = require('../controllers/authController');
const { body } = require('express-validator');

router.post('/login', [
  body('account_number').notEmpty(),
  body('password').notEmpty()
], login);

router.post('/refresh', [
  body('refreshToken').notEmpty()
], refreshToken);

module.exports = router; 