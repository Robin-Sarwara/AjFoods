const { searchFood } = require('../controllers/SearchBarController');

const router = require('express').Router();

router.get('/search', searchFood)

module.exports = router