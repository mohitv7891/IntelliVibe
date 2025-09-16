const Job = require('../models/Job');



/**
 * @route   GET /api/jobs/:id
 */
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        
        res.json(job);
    } catch (error) {
        console.error("Error fetching job:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid job ID format' });
        }
        
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.createJob = async (req, res) => {
  
    console.log("Received request to create job with body:", req.body);

    const { 
        title, companyName, location, skills, salary, 
        jobType, description, expiryDate, isActive, interviewDuration 
    } = req.body;


    if (!skills || !Array.isArray(skills)) {
        return res.status(400).json({ message: "The 'skills' field must be a non-empty array." });
    }

    try {
        const job = new Job({
            title, companyName, location, skills, salary, 
            jobType, description, expiryDate, isActive, interviewDuration,
            postedBy: req.user._id,
        });

        const createdJob = await job.save();
        res.status(201).json(createdJob);
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({ message: 'A critical server error occurred.' });
    }
};

/**
 * @desc    Get jobs for the logged-in employer
 * @route   GET /api/jobs/myjobs
 * @access  Private/Employer
 * @description Fetches all jobs posted by the currently authenticated employer.
 */
exports.getMyJobs = async (req, res) => {
    try {
        // Sort by 'createdAt: -1' to show the newest jobs first
        const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Get all jobs (for candidates)
 * @route   GET /api/jobs
 * @access  Public
 * @description Fetches all ACTIVE jobs for the public job board.
 */
exports.getAllJobs = async (req, res) => {
    try {
        // Only find jobs where 'isActive' is true
        // Sort by 'createdAt: -1' to show the newest jobs first
        const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};