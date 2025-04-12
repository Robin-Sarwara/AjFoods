const Products = require("../models/Products");

const getRelatedProducts =async(req, res)=>{
    try {
        const tags = req.query.tags?.split(",") || []; 
        const excludedId = req.query.exclude;

        const relatedProducts = await Products.find({
            tags:{$in: tags},
            _id:{$ne: excludedId}
        }).limit(5);

        res.status(200).json({relatedProducts})
    } catch (error) {
        res.status(500).json({message:"Internal server error", error: error.message})
    }
}

module.exports = {getRelatedProducts}