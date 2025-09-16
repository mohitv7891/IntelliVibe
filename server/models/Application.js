const mongoose = require('mongoose');
const stageHistorySchema = new mongoose.Schema({
    stage: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['completed', 'passed', 'failed', 'in_progress', 'scheduled'],
        required: true,
    },
    score: Number,
    notes: String,
    scheduledDate: Date,
    employerContact: {
        name: String,
        email: String,
        phone: String,
    },
});


const quizResultSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userAnswer: Number,
    correctAnswer: Number,
    isCorrect: Boolean,
});

const videoTranscriptSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewQuestion' }, 
    question: String,
    answer: String,
    duration: Number, 
});

const applicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeUrl: { type: String, required: true },
    
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'selected_for_employer', 'hired', 'AI Interview Passed', 'AI Interview Failed'],
        default: 'pending',
    },
    
    // Screening stage tracking - Updated with new stages
    screeningStage: {
        type: String,
        enum: [
            'resume_uploaded',
            'resume_screening',
            'resume_rejected',
            'quiz_pending',
            'quiz_in_progress',
            'quiz_failed',
            'video_pending',
            'video_in_progress',
            'video_completed',
            'final_review',
            'selected_for_employer',
            'employer_scheduled',
            'employer_interview_completed',
            'hired',
            'manual_review_needed'
        ],
        default: 'resume_uploaded',
    },
    
    stageHistory: [stageHistorySchema],
    
    aiMatchScore: { type: Number, min: 0, max: 100, default: null },
    aiJustification: { type: String, default: null },
    aiAnalysisDate: { type: Date, default: null },
    
    // --- IMPROVEMENT: Provide a default to prevent runtime errors ---
    skillsGapAnalysis: {
        type: {
            matched: [String],
            missing: [String],
            additional: [String],
            matchPercentage: Number,
        },
        default: () => ({ matched: [], missing: [], additional: [] })
    },
    
    quizStartedAt: { type: Date, default: null },
    quizCompletedAt: { type: Date, default: null },
    quizScore: { type: Number, min: 0, max: 100, default: null },
    quizResults: [quizResultSchema],
    quizAttempts: { type: Number, default: 0 },
    
    videoInterviewUrl: { type: String, default: null },
    videoInterviewStartedAt: { type: Date, default: null },
    videoInterviewCompletedAt: { type: Date, default: null },
    
    // --- IMPROVEMENT: Provide a default and use the new transcript schema ---
    videoAnalysisReport: {
        type: {
            overallScore: Number,
            communicationScore: Number,
            technicalScore: Number,
            confidenceScore: Number,
            transcripts: [videoTranscriptSchema], // Use the defined schema
            feedback: String,
            redFlags: [String],
        },
        default: () => ({ transcripts: [], redFlags: [] })
    },
    
    // Employer scheduling fields
    employerInterview: {
        scheduledDate: Date,
        scheduledTime: String,
        interviewType: {
            type: String,
            enum: ['phone', 'video', 'onsite'],
            default: 'video'
        },
        employerContact: {
            name: String,
            email: String,
            phone: String,
        },
        meetingLink: String,
        location: String,
        notes: String,
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending'
        },
        feedback: String,
        decision: {
            type: String,
            enum: ['hired', 'rejected', 'pending'],
            default: 'pending'
        }
    },
    
    // Auto-processing flags
    autoProcessed: {
        type: Boolean,
        default: false,
    },
    autoProcessedAt: {
        type: Date,
        default: null,
    },
    
    overallScore: { type: Number, default: null },
    scoringBreakdown: {
        resumeWeight: { type: Number, default: 40 },
        quizWeight: { type: Number, default: 30 },
        videoWeight: { type: Number, default: 30 },
    },
    
    // Progress tracking
    progressPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    
}, {
    timestamps: true,
});

applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
applicationSchema.index({ job: 1, screeningStage: 1 });
applicationSchema.index({ candidate: 1, status: 1 });

applicationSchema.pre('save', function(next) {
    if (this.isModified('aiMatchScore') || this.isModified('quizScore') || this.isModified('videoAnalysisReport.overallScore')) {
        const breakdown = this.scoringBreakdown;
        let totalWeight = 0;
        let weightedScore = 0;
        
        if (this.aiMatchScore !== null) {
            weightedScore += this.aiMatchScore * (breakdown.resumeWeight / 100);
            totalWeight += breakdown.resumeWeight;
        }
        
        if (this.quizScore !== null) {
            weightedScore += this.quizScore * (breakdown.quizWeight / 100);
            totalWeight += breakdown.quizWeight;
        }
        
        // Use optional chaining for safety
        if (this.videoAnalysisReport?.overallScore != null) {
            weightedScore += this.videoAnalysisReport.overallScore * (breakdown.videoWeight / 100);
            totalWeight += breakdown.videoWeight;
        }
        
        this.overallScore = totalWeight > 0 ? Math.round((weightedScore * 100) / totalWeight) : null;
    }
    
    next();
});

applicationSchema.methods.calculateProgressPercentage = function() {
    const stageProgress = {
        'resume_uploaded': 10,
        'resume_screening': 20,
        'resume_rejected': 100, // End state
        'quiz_pending': 30,
        'quiz_in_progress': 40,
        'quiz_failed': 100, // End state
        'video_pending': 50,
        'video_in_progress': 60,
        'video_completed': 70,
        'video_failed': 100, // End state
        'final_review': 80,
        'selected_for_employer': 85,
        'employer_scheduled': 90,
        'employer_interview_completed': 95,
        'hired': 100,
        'manual_review_needed': 25
    };
    
    this.progressPercentage = stageProgress[this.screeningStage] || 0;
    return this.progressPercentage;
};

applicationSchema.methods.getCurrentStageInfo = function() {
    const stageInfo = {
        'resume_uploaded': {
            title: 'Resume Uploaded',
            description: 'Your resume has been uploaded and is being processed',
            icon: '📄',
            color: 'blue'
        },
        'resume_screening': {
            title: 'AI Resume Analysis',
            description: 'AI is analyzing your resume against job requirements',
            icon: '🤖',
            color: 'blue'
        },
        'resume_rejected': {
            title: 'Resume Screening Failed',
            description: 'Your resume did not meet the minimum requirements',
            icon: '❌',
            color: 'red'
        },
        'quiz_pending': {
            title: 'Skills Assessment Pending',
            description: 'You qualify for the technical skills assessment',
            icon: '📝',
            color: 'green'
        },
        'quiz_in_progress': {
            title: 'Skills Assessment in Progress',
            description: 'Complete the technical skills assessment',
            icon: '⏳',
            color: 'yellow'
        },
        'quiz_failed': {
            title: 'Skills Assessment Failed',
            description: 'You did not pass the technical skills assessment',
            icon: '❌',
            color: 'red'
        },
        'video_pending': {
            title: 'Video Interview Pending',
            description: 'You qualify for the AI-powered video interview',
            icon: '🎥',
            color: 'green'
        },
        'video_in_progress': {
            title: 'Video Interview in Progress',
            description: 'Complete the AI-powered video interview',
            icon: '⏳',
            color: 'yellow'
        },
        'video_completed': {
            title: 'Video Interview Completed',
            description: 'Your video interview has been analyzed',
            icon: '✅',
            color: 'green'
        },
        'video_failed': {
            title: 'Video Interview Failed',
            description: 'You did not pass the video interview',
            icon: '❌',
            color: 'red'
        },
        'final_review': {
            title: 'Final Review',
            description: 'Your application is under final review',
            icon: '🔍',
            color: 'blue'
        },
        'selected_for_employer': {
            title: 'Selected for Employer Interview',
            description: 'Congratulations! You\'ve been selected for the final interview',
            icon: '🎉',
            color: 'green'
        },
        'employer_scheduled': {
            title: 'Employer Interview Scheduled',
            description: 'Your interview with the employer has been scheduled',
            icon: '📅',
            color: 'green'
        },
        'employer_interview_completed': {
            title: 'Employer Interview Completed',
            description: 'Your interview with the employer has been completed',
            icon: '✅',
            color: 'blue'
        },
        'hired': {
            title: 'Hired',
            description: 'Congratulations! You have been hired',
            icon: '🎊',
            color: 'green'
        },
        'manual_review_needed': {
            title: 'Manual Review Required',
            description: 'Your application requires manual review',
            icon: '👤',
            color: 'orange'
        }
    };
    
    return stageInfo[this.screeningStage] || {
        title: 'Unknown Stage',
        description: 'Application status is unclear',
        icon: '❓',
        color: 'gray'
    };
};

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;