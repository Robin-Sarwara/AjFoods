const Products = require('../models/Products');

const answerController = async(req, res)=>{
    try {
        const {answer} = req.body;
    const {questionId, productId} = req.params;

    const product = await Products.findById(productId);
    if(!product){
        return res.status(404).json({message:"Product not found"})
    };
    const question = product.questions.id(questionId)
    if(!question){
        return res.status(404).json({message:"Question not found"})
    }
    question.answer = answer
    product.updatedAt = Date.now();

    await product.save();

    res.status(200).json({message:"Answer added successfully", product})
    } catch (error) {
       res.status(500).json({message:"Internal server error", error:error.message}) 
    }
}

const editAnswer = async(req, res)=>{
    try {
        const {questionId, productId} = req.params;
    const {answer} = req.body;

    const product  = await Products.findById(productId)
    if(!product){
        return res.status(404).json({message:"Product not found"})
    }
    const question = product.questions.id(questionId)
    if(!question){
        return res.status(404).json({
            message:"Question not found"
        })
    }
    question.answer = answer;
    product.updatedAt = Date.now();
    await product.save();
    res.status(200).json({message:"Answer updated successfully", question})
    } catch (error) {
        res.status(500).json({message:"Internal server error", error:error.message})
    }
    

}

const getAnswer = async(req,res)=>{
    try {
        const {questionId, productId} = req.params;

    const product  = await Products.findById(productId)
    if(!product){
        return res.status(404).json({message:"Product not found"})
    }
    const question = product.questions.id(questionId)
    if(!question){
        return res.status(404).json({
            message:"Question not found"
        })
    }
    res.status(200).json({question})
    } catch (error) {
        res.status(500).json({message:"Internal server error", error:error.message})
    }
}

module.exports = {answerController,editAnswer,getAnswer}