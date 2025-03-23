const Products = require("../models/Products");
const mongoose = require("mongoose");

const getAllUserQuestion = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const userQuestions = await Products.aggregate([
      { $unwind: "$questions" },
      { $match: { "questions.userId": userId } },
      {
        $project: {
          productId: "$_id",
          productName: "$name",
          questionId: "$questions._id",
          question: "$questions.question",
          answer: "$questions.answer",
          timestamp: "$questions.timestamp",
        },
      },
      { $sort: { timestamp: -1 } },
    ]);

    res.status(200).json({
      success: true,
      questions: userQuestions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteUserQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const product = await Products.findOne({ "questions._id": questionId });
    if (!product) {
      return res.status(404).json({ message: "Question not found" });
    }

    const question = product.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found in product" });
    }

    product.questions.pull(questionId);

    await product.save();
    return res
      .status(200)
      .json({ message: "Question deleted successfully", question });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const updateUserQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const { newQuestion } = req.body;

    const product = await Products.findOne({ "questions._id": questionId });
    if (!product) {
      return res.status(404).json({ message: "Question not found" });
    }
    const question = product.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ message: "question not found in product" });
    }

    question.question = newQuestion;
    product.updatedAt = Date.now();
    await product.save();

    return res
      .status(200)
      .json({ message: "Product updated successfully", question });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { getAllUserQuestion, deleteUserQuestion, updateUserQuestion };
