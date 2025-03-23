// middleware/feedbackValidation.js
const Joi = require("joi");

const questionValidation = (req, res, next) => {
  const schema = Joi.object({
    question: Joi.string().min(5).max(500).required()
  });
  const { error } = schema.validate({ question: req.body.question });
  if (error) {
    return res.status(400).json({ message: "Bad request", error: error.message });
  }
  next();
};

const reviewValidation = (req, res, next) => {
  const schema = Joi.object({
    reviewText: Joi.string().min(5).max(500).required(),
    rating: Joi.number().min(1).max(5).required()
  });
  const { error } = schema.validate({ reviewText: req.body.reviewText, rating: req.body.rating });
  if (error) {
    return res.status(400).json({ message: "Bad request", error: error.message });
  }
  next();
};

module.exports = { questionValidation, reviewValidation };
