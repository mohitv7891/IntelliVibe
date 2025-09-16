const express = require('express');
const router = express.Router();
const { protect, employer } = require('../middleware/authMiddleware');
const { createJob, getMyJobs, getAllJobs, getJobById } = require('../controllers/jobController');

router.route('/').get(getAllJobs);

router.route('/').post(protect, employer, createJob);
router.route('/myjobs').get(protect, employer, getMyJobs);

router.route('/:id').get(protect, getJobById);

module.exports = router;