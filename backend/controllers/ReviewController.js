const Products = require("../models/Products");
const { findById } = require("../models/user");

const addReview = async(req, res)=>{
    try {
        const id = req.params.id;
    const {reviewText, userId, rating, userName} = req.body;

    const product = await Products.findById(id);
    if(!product){
        res.status(404).json({message:"Product not found"})
    }
    const review = product.reviews
    product.reviews.push({reviewText, userId, rating, userName})
    
    product.updatedAt = Date.now()
    await product.save();
    res.status(200).json({message:"Review added successfully",review} )
    } catch (error) {
       res.status(500).json({message:"Internal server error", error:error.message}) 
    }
}

const getReview = async(req, res)=>{
    try {
        const id = req.params.id;
        const product = await Products.findById(id);
        if(!product){
            res.staus(404).json({message:"Product not found"})
        }
        const review = product.reviews
        res.status(200).json({success:true, review})
    } catch (error) {
        
    }
}

const updateReview = async(req, res)=>{
    try {
        const id = req.params.id;
        const {newReviewText, newRating} = req.body;

        const product = await Products.findOne({"reviews._id":id})
        if(!product){
            return res.status(404).json({message:"Product not found"})
        }

       const review = product.reviews.id(id)
       if(!review){
        return res.status(404).json({message:"Review not found"})
       }

       review.reviewText = newReviewText;
       review.rating = newRating

       product.updatedAt = Date.now();
       await product.save();
       res.status(200).json({message:"Product updated successfully", review})
    } catch (error) {
        res.status(500).json({message:"Internal server error", error:error.message})
    }
}

const deletereview = async(req, res)=>{
    try {
        const id = req.params.id
        
        const product = await Products.findOne({"reviews._id":id});
        if(!product){
            return res.status(404).json({message:"Review not found"})
        }

        const review = product.reviews.id(id)
        
        product.reviews.pull(id);

        await product.save();
        res.status(200).json({message:"Review deleted successfully",reviews:product.reviews})
         
    } catch (error) {
       res.status(500).json({message:"Internal server error", error:error.message})
    }
}

const reviewUpvote = async(req, res)=>{
    try {
        const id = req.params.id;
        const {userId} = req.body;

        const product = await Products.findOne({'reviews._id':id})
        if(!product){
            return res.status(404).josn({message:"Review not found"})
        }
        const review = product.reviews.id(id)

        if(review.upvotes.includes(userId)){
            return res.status(400).json({message:"You have already upvotes this review"})
        }

        review.upvotes.push(userId);
        await product.save();
        res.status(200).json({
            message: "Review upvoted successfully",
            review,
          });
        } catch (error) {
          res.status(500).json({ message: "Internal server error", error: error.message });
        }
}

const fetchSortReviews = async(req, res)=>{
    try {
        const id = req.params.id;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    const product = await Products.findById(id);
    if(!product){
        return res.status(404).json({message:"Product not found"})
    }

    let reviews = product.reviews.sort((a,b)=>b.upvotes.length-a.upvotes.length);

    if(limit){
        reviews = reviews.slice(0, limit)
    }

    res.status(200).json({reviews})
    } catch (error) {
        res.status(500).json({message:"Internal server error", error:error.message})
    }
    
}

const removeUpvote = async(req,res)=>{
    try {
        const id = req.params.id;
    const {userId} = req.body;

    const product = await Products.findOne({'reviews._id':id})
    if(!product){
        return res.status(404).json({message:"Product not found"})
    }
    const review = product.reviews.id(id)

    if(!review.upvotes.includes(userId)){
        return res.status(400).json({message:"You haven't upvoted yet !"})
    }
    const upvotedReview = review.upvotes.pull(userId)
    
    await product.save();
    res.status(200).json({message:"Upvote removed successfully",review })
    } catch (error) {
     res.status(500).json({message:"Internal server error", error:error.message})   
    }
    
    
}
module.exports = {addReview, getReview, reviewUpvote, fetchSortReviews, removeUpvote, updateReview, deletereview }

