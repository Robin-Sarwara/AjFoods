const express = require('express');
const { refreshAccessToken } = require('../controllers/AuthController');
const router = express.Router();

router.put('/refresh-token', refreshAccessToken)

module.exports = router