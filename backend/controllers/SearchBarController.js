const Products = require("../models/Products");

const searchFood = async(req, res)=>{
    try {
        const query = req.query.query;

        const results = await Products.find({
            tags: {$regex: query, $options: 'i' }
        })

        res.status(200).json({results})
    } catch (error) {
        res.status(500).json({message:"Internal server error", error: error.message})
    }
}


module.exports ={searchFood}