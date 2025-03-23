const Products = require('../models/Products');

const addFeedback =async (req, res) => {
    try {
      const { userId, question, rating, reviewText } = req.body;
      const productId = req.params.id;
  
      if (!userId) {
        return res.status(400).json({ message: "Please login before writing review" });
      } 
  
      const product = await Products.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

        product.questions.push({ userId, question });
  
      product.updatedAt = Date.now();
      await product.save();
  
      res.status(200).json({
        message: "Feedback added successfully",
        product,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

const getFeedback = async(req,res)=>{
     try {
        const productId = req.params.id
        const product = await Products.findById(productId);
        if(!product){
            return res.status(404).json({message:"product not found"})
        }
        const questionsData = product.questions;
        const reviewData = product.reviews;
    
        res.status(200).json({success:true, questionsData, reviewData})
     } catch (error) {
        res.status(500).json({message:"Internal server error", error:error.message})
     } 
  }

const deleteQuestion = async(req,res)=>{
    try {
        const {productId, questionId} = req.params
        const product = await Products.findById(productId);
        if(!product){
            return res.status(404).json({message:"Product not found"})
        }
        const question = product.questions.id(questionId)
        if(!question){
            return res.status(404).json({message:"question not found"})
        }
        question.deleteOne()
        await product.save();
        res.status(200).json({success:true ,message:"Question deleted successfully"})
    } catch (error) {
        res.status(500).json({message:"Internal server error", error:error.message})
    }
  }

  const mostAskedQuestion = async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Products.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Object to store aggregated data
      const questionAggregation = {};
  
      product.questions.forEach(q => {
        const qText = q.question.trim().toLowerCase();
        if (!questionAggregation[qText]) {
          // Initialize with count and an object to tally answers
          questionAggregation[qText] = { count: 0, answers: {} };
        }
        questionAggregation[qText].count++;
  
        // If there is an answer, tally it
        if (q.answer && q.answer.trim() !== "") {
          const answerText = q.answer.trim();
          questionAggregation[qText].answers[answerText] =
            (questionAggregation[qText].answers[answerText] || 0) + 1;
        }
      });
  
      // Transform the aggregation into an array and pick a canonical answer
      const aggregatedQuestions = Object.entries(questionAggregation).map(([question, data]) => {
        let canonicalAnswer = null;
        let maxAnswerCount = 0;
  
        // Select the answer that appears most frequently
        Object.entries(data.answers).forEach(([answer, count]) => {
          if (count > maxAnswerCount) {
            canonicalAnswer = answer;
            maxAnswerCount = count;
          }
        });
  
        return { question, count: data.count, answer: canonicalAnswer };
      });
  
      // Sort by the number of times the question was asked
      aggregatedQuestions.sort((a, b) => b.count - a.count);
  
      // Select the top 5
      const top5Questions = aggregatedQuestions.slice(0, 5);
  
      res.status(200).json({
        success: true,
        top5Questions,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };
  

  module.exports = {addFeedback, getFeedback, deleteQuestion,mostAskedQuestion}