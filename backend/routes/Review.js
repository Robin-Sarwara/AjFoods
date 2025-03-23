const express = require('express');
const { addReview, getReview, reviewUpvote, fetchSortReviews, removeUpvote, updateReview, deletereview } = require('../controllers/ReviewController');
const { EnsureAuthenticated } = require('../middleware/EnsureAuthenticated');
const { reviewValidation } = require('../middleware/feedbackValidation');
const { checkUserReviewForDeletion, checkUserReviewForEditing } = require('../middleware/checkUserReview');
const router = express.Router();

router.post('/products/:id/review',EnsureAuthenticated,reviewValidation,addReview)
router.post('/products/review/:id', EnsureAuthenticated, reviewUpvote)
router.get('/products/:id/review', getReview)
router.get('/products/:id/sortedReview', fetchSortReviews)
router.delete('/products/review/:id/remove-upvote',EnsureAuthenticated, removeUpvote)
router.put('/products/review/:id', EnsureAuthenticated,checkUserReviewForEditing ,updateReview)
router.delete('/products/review/:id', EnsureAuthenticated,checkUserReviewForDeletion, deletereview)


module.exports = router