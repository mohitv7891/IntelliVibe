const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const path = require('path');
const fs = require('fs').promises;
const pdfParse = require('pdf-parse');

const createApplication = async (applicationData) => {
    const { jobId, userId, resumeUrl } = applicationData;
    
    // Check if user already applied for this job
    const existingApplication = await Application.findOne({ 
      job: jobId, 
      candidate: userId 
    });
    
    if (existingApplication) {
      throw new Error('You have already applied for this job');
    }

    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const application = await Application.create({
      job: jobId,
      candidate: userId,
      resumeUrl,
      status: 'Applied',
      screeningStage: 'resume_review'
    });

    return application;
  };

const getApplicationsByJob = async (jobId, employerId) => {
    // Verify the job belongs to the employer
    const job = await Job.findOne({ _id: jobId, employer: employerId });
    if (!job) {
      throw new Error('Job not found or access denied');
    }

    const applications = await Application.find({ job: jobId })
      .populate('candidate', 'firstName lastName email')
      .populate('job', 'title company');

    return applications;
  };

const getCandidateApplications = async (candidateId) => {
    const applications = await Application.find({ candidate: candidateId })
      .populate('job', 'title company location')
      .sort({ createdAt: -1 });

    return applications;
  };

const updateApplicationStatus = async (applicationId, status, employerId) => {
    const application = await Application.findById(applicationId)
      .populate('job');

    if (!application) {
      throw new Error('Application not found');
    }

    // Verify the job belongs to the employer
    if (application.job.employer.toString() !== employerId) {
      throw new Error('Access denied');
    }

    application.status = status;
    
    // Update screening stage based on status
    if (status === 'AI Interview Passed') {
      application.screeningStage = 'video_completed';
    } else if (status === 'AI Interview Failed') {
      application.screeningStage = 'video_failed';
    } else if (status === 'Employer Interview Scheduled') {
      application.screeningStage = 'employer_interview_scheduled';
    } else if (status === 'Employer Interview Completed') {
      application.screeningStage = 'employer_interview_completed';
    }

    await application.save();
    return application;
  };

const getApplicationById = async (applicationId, userId, userRole) => {
    const application = await Application.findById(applicationId)
      .populate('job')
      .populate('candidate', 'firstName lastName email');

    if (!application) {
      throw new Error('Application not found');
    }

    // Check access permissions
    const hasAccess = userRole === 'employer' 
      ? application.job.employer.toString() === userId
      : application.candidate._id.toString() === userId;

    if (!hasAccess) {
      throw new Error('Access denied');
    }

    return application;
  };

const getQuizForApplication = async (applicationId, userId) => {
    const application = await Application.findById(applicationId)
      .populate('job');

    if (!application) {
      throw new Error('Application not found');
    }

    // Verify the application belongs to the user
    if (application.candidate.toString() !== userId) {
      throw new Error('Access denied');
    }

    // Get quiz for the job
    const quiz = await Quiz.findOne({ job: application.job._id });
    if (!quiz) {
      throw new Error('No quiz found for this job');
    }

    return quiz;
  };

const submitQuizAnswers = async (applicationId, answers, userId) => {
    const application = await Application.findById(applicationId);
    
    if (!application) {
      throw new Error('Application not found');
    }

    // Verify the application belongs to the user
    if (application.candidate.toString() !== userId) {
      throw new Error('Access denied');
    }

    // Calculate score
    const quiz = await Quiz.findOne({ job: application.job });
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    let score = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++;
      }
    });

    const percentage = (score / totalQuestions) * 100;

    // Update application
    application.quizScore = percentage;
    application.quizAnswers = answers;
    application.screeningStage = percentage >= 70 ? 'quiz_passed' : 'quiz_failed';
    application.status = percentage >= 70 ? 'Quiz Passed' : 'Quiz Failed';

    await application.save();
    return { score: percentage, passed: percentage >= 70 };
  };

const completeVideoInterview = async (applicationId, analysis, userId) => {
    const application = await Application.findById(applicationId);
    
    if (!application) {
      throw new Error('Application not found');
    }

    // Verify the application belongs to the user
    if (application.candidate.toString() !== userId) {
      throw new Error('Access denied');
    }

    application.videoAnalysisReport = {
      overallScore: analysis.score,
      summary: analysis.summary,
    };
    application.status = analysis.status;
    application.screeningStage = analysis.status === 'AI Interview Passed' ? 'video_completed' : 'video_failed';

    await application.save();
    return application;
  };

const scheduleEmployerInterview = async (applicationId, interviewData, employerId) => {
    const application = await Application.findById(applicationId)
      .populate('job');

    if (!application) {
      throw new Error('Application not found');
    }

    // Verify the job belongs to the employer
    if (application.job.employer.toString() !== employerId) {
      throw new Error('Access denied');
    }

    application.employerInterview = {
      scheduledDate: interviewData.scheduledDate,
      meetingLink: interviewData.meetingLink,
      notes: interviewData.notes
    };
    application.status = 'Employer Interview Scheduled';
    application.screeningStage = 'employer_interview_scheduled';

    await application.save();
    return application;
  };

const completeEmployerInterview = async (applicationId, interviewData, employerId) => {
    const application = await Application.findById(applicationId)
      .populate('job');

    if (!application) {
      throw new Error('Application not found');
    }

    // Verify the job belongs to the employer
    if (application.job.employer.toString() !== employerId) {
      throw new Error('Access denied');
    }

    application.employerInterview = {
      ...application.employerInterview,
      completedDate: new Date(),
      feedback: interviewData.feedback,
      rating: interviewData.rating,
      decision: interviewData.decision
    };
    application.status = interviewData.decision === 'Hired' ? 'Hired' : 'Rejected';
    application.screeningStage = 'employer_interview_completed';

    await application.save();
    return application;
  };

const extractResumeText = async (resumePath) => {
    try {
      const dataBuffer = await fs.readFile(resumePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      console.error('Error extracting resume text:', error);
      throw new Error('Failed to extract resume text');
    }
  };

module.exports = {
  createApplication,
  getApplicationsByJob,
  getCandidateApplications,
  updateApplicationStatus,
  getApplicationById,
  getQuizForApplication,
  submitQuizAnswers,
  completeVideoInterview,
  scheduleEmployerInterview,
  completeEmployerInterview,
  extractResumeText,
};
