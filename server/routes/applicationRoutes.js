const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, employer } = require('../middleware/authMiddleware');


const { 
    applyForJob, 
    getApplicantsForJob,
    getMyCandidateApplications,
    getQuizForApplication,
    submitQuizAnswers,
    updateApplicationStatus,
    getApplicationQuiz,
    submitApplicationQuiz,
    completeVideoInterview,
    scheduleEmployerInterview,
    completeEmployerInterview
} = require('../controllers/applicationController');


router.get('/:id/quiz', protect, getApplicationQuiz);
router.get('/:applicationId/quiz', protect, getQuizForApplication);
router.post('/:applicationId/quiz/submit', protect, submitQuizAnswers);

// Setup multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Generate a unique filename without relying on req.user
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${uniqueSuffix}-${name}${ext}`);
    }
});

// File filter to only accept PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// === ROUTES ===

router.post('/', protect, upload.single('resume'), applyForJob);

// GET route for an employer to see applicants
router.get('/job/:jobId', protect, employer, getApplicantsForJob);


// PUT route to update application status (if you have this controller function)
router.put('/:applicationId/status', protect, employer, updateApplicationStatus);


// Add this route for candidates to view their applications
router.get('/my-applications', protect, getMyCandidateApplications);


router.post('/:id/quiz/submit', protect, submitApplicationQuiz);
router.post('/:id/video-complete', protect, completeVideoInterview);
router.post('/:id/schedule-employer-interview', protect, employer, scheduleEmployerInterview);
router.post('/:id/complete-employer-interview', protect, employer, completeEmployerInterview);

module.exports = router;