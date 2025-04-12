const { getRelatedProducts } = require('../controllers/RelatedProductsController');

const router = require('express').Router();

router.get('/related-products', getRelatedProducts)

module.exports = router