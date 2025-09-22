const Job = require('../models/Job');
const User = require('../models/User');

const createJob = async (jobData, employerId) => {
    // Verify employer exists
    const employer = await User.findById(employerId);
    if (!employer || employer.role !== 'employer') {
      throw new Error('Invalid employer');
    }

    const job = await Job.create({
      ...jobData,
      employer: employerId
    });

    return job;
  };

const getJobsByEmployer = async (employerId) => {
    const jobs = await Job.find({ employer: employerId })
      .sort({ createdAt: -1 });

    return jobs;
  };

const getAllJobs = async () => {
    const jobs = await Job.find({})
      .populate('employer', 'firstName lastName company')
      .sort({ createdAt: -1 });

    return jobs;
  };

const getJobById = async (jobId, userId = null) => {
    const job = await Job.findById(jobId)
      .populate('employer', 'firstName lastName company email');

    if (!job) {
      throw new Error('Job not found');
    }

    // If user is provided, check if they can access this job
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Employers can only see their own jobs, candidates can see all jobs
      if (user.role === 'employer' && job.employer._id.toString() !== userId) {
        throw new Error('Access denied');
      }
    }

    return job;
  };

const updateJob = async (jobId, updateData, employerId) => {
    const job = await Job.findById(jobId);

    if (!job) {
      throw new Error('Job not found');
    }

    // Verify the job belongs to the employer
    if (job.employer.toString() !== employerId) {
      throw new Error('Access denied');
    }

    Object.assign(job, updateData);
    await job.save();

    return job;
  };

const deleteJob = async (jobId, employerId) => {
    const job = await Job.findById(jobId);

    if (!job) {
      throw new Error('Job not found');
    }

    // Verify the job belongs to the employer
    if (job.employer.toString() !== employerId) {
      throw new Error('Access denied');
    }

    await Job.findByIdAndDelete(jobId);
    return { message: 'Job deleted successfully' };
  };

const searchJobs = async (searchCriteria) => {
    const { title, location, skills, company } = searchCriteria;
    const query = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (company) {
      query.company = { $regex: company, $options: 'i' };
    }

    if (skills && skills.length > 0) {
      query.skills = { $in: skills };
    }

    const jobs = await Job.find(query)
      .populate('employer', 'firstName lastName company')
      .sort({ createdAt: -1 });

    return jobs;
  };

const getJobStatistics = async (employerId) => {
    const totalJobs = await Job.countDocuments({ employer: employerId });
    const activeJobs = await Job.countDocuments({ 
      employer: employerId, 
      status: 'active' 
    });
    const closedJobs = await Job.countDocuments({ 
      employer: employerId, 
      status: 'closed' 
    });

    return {
      totalJobs,
      activeJobs,
      closedJobs
    };
  };

module.exports = {
  createJob,
  getJobsByEmployer,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  searchJobs,
  getJobStatistics,
};
