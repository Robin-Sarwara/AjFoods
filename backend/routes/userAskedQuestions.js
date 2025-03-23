const express = require('express');
const { EnsureAuthenticated } = require('../middleware/EnsureAuthenticated');
const { getAllUserQuestion, deleteUserQuestion, updateUserQuestion } = require('../controllers/userQuesController');
const { checkAdminAnswer } = require('../middleware/checkAdminAns');
const router = express.Router();

router.get('/user/asked-questions',EnsureAuthenticated,getAllUserQuestion)
router.delete('/user/asked-questions/delete/question/:id',EnsureAuthenticated,deleteUserQuestion)
router.put('/user/asked-questions/update/question/:id',EnsureAuthenticated,checkAdminAnswer, updateUserQuestion)

module.exports = router