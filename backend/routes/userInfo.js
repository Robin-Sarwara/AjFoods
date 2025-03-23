const express = require('express');
const { userInfo } = require('../controllers/AuthController');
const router = express.Router();


router.get('/user-info', userInfo)

module.exports=router