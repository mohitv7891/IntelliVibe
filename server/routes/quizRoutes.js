const express = require('express');
const router = express.Router();
const { startQuiz, submitQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware'); // Your authentication middleware

router.get('/:applicationId', protect, startQuiz);
router.post('/:applicationId/submit', protect, submitQuiz);

module.exports = router;