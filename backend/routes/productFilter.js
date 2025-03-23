const express = require('express');
const Products = require('../models/Products');
const router = express.Router();

router.get('/discounted', async(req, res)=>{
    try {
        const discountedProducts = await Products.find({ discount: { $gt: 0 } })
      .sort({ discount: -1 }) // Sort by highest discount first
      .limit(5);

    res.json(discountedProducts)
    } catch (error) {
        res.status(500).json({
            message:"Internal server error",
            error
        })
    }
})

module.exports = router