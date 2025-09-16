const express = require('express');
const router = express.Router();
const { protect, employer } = require('../middleware/authMiddleware');
const {
    getVideoInterviewReport,
    getApplicationReports,
    getCandidatePerformanceReport,
    getJobAnalyticsReport,
    exportReportData
} = require('../controllers/reportController');

router.get('/video-interview/:applicationId', protect, employer, getVideoInterviewReport);

router.get('/applications/:jobId', protect, employer, getApplicationReports);
router.get('/candidate-performance/:candidateId', protect, employer, getCandidatePerformanceReport);
router.get('/job-analytics/:jobId', protect, employer, getJobAnalyticsReport);
router.get('/export/:type/:id', protect, employer, exportReportData);

module.exports = router;