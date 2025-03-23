const Products = require("../models/Products");

const checkUserReviewForDeletion  =async (req,res,next)=>{
    try {
        const reviewId = req.params.id;
        const {userId} = req.body;
        const {role} = req.body;

        const product = await Products.findOne({'reviews._id':reviewId});
        if(!product){
            return res.status(404).json({message:"Product not found"})
        };

        const review = product.reviews.id(reviewId)
        if(!review){
            return res.status(404).json({message:"Review not found "})
        }

        if(role!=="admin" && review.userId.toString() !== userId){
            return res.status(400).json({message:"You don't have permission to modify this review"})
        }   
        next();


    } catch (error) {
       res.status(500).json({message:"Internal server error", error:error.message}) 
    }
}

const checkUserReviewForEditing  =async (req,res,next)=>{
    try {
        const reviewId = req.params.id;
        const {userId} = req.body;
        const {role} = req.body;

        const product = await Products.findOne({'reviews._id':reviewId});
        if(!product){
            return res.status(404).json({message:"Product not found"})
        };

        const review = product.reviews.id(reviewId)
        if(!review){
            return res.status(404).json({message:"Review not found "})
        }

        if(role!=="admin" && review.userId.toString() !== userId){
            return res.status(400).json({message:"You don't have permission to modify this review"})
        }   
        next();


    } catch (error) {
       res.status(500).json({message:"Internal server error", error:error.message}) 
    }
}

module.exports ={checkUserReviewForEditing, checkUserReviewForDeletion}