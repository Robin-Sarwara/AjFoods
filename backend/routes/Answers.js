const express =  require('express');
const { isAdmin, EnsureAuthenticated } = require('../middleware/EnsureAuthenticated');
const {answerController, editAnswer, getAnswer} = require('../controllers/AnswerController');
const router = express.Router();

router.post('/products/:productId/question/:questionId/answer', EnsureAuthenticated, isAdmin,answerController )
router.put('/products/:productId/question/:questionId/update-answer', EnsureAuthenticated, isAdmin, editAnswer )
router.get('/products/:productId/question/:questionId/get-answer',getAnswer)

module.exports = router 