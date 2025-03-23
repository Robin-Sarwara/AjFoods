const Products = require("../models/Products")

const checkAdminAnswer = async(req, res, next)=>{

    try {
        const questionId = req.params.id

        const product = await Products.findOne({"questions._id": questionId })
        console.log(questionId)
        console.log(product)
        if(!product){
           return res.status(404).json({message:"question not found"})
        }
        const question = product.questions.id(questionId)
        if(!question){
            return res.status(404).json({message:"Question not found"})
        }
        if(question.answer){
            return res.status(403).json({message:"Question already answered by admin. Editing is not allowed. "})
        }
        next();
           
    } catch (error) {
        res.status(500).json({message:"Internal server error", error:error.message})
    }
    
}

module.exports = {checkAdminAnswer}