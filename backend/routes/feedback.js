const express = require('express');
const { addFeedback, getFeedback, deleteQuestion, mostAskedQuestion } = require('../controllers/FeedbackController');
const { EnsureAuthenticated, isAdmin } = require('../middleware/EnsureAuthenticated');
const { questionValidation } = require('../middleware/feedbackValidation');
const router = express.Router();

router.post('/products/:id/feedback',EnsureAuthenticated,questionValidation,addFeedback );
router.get('/products/:id/feedback', getFeedback);
router.delete('/products/:productId/question/:questionId', EnsureAuthenticated, isAdmin, deleteQuestion)
router.get('/products/:id/most-asked-questions', mostAskedQuestion)
  

module.exports = router