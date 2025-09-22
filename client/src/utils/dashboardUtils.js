import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const fetchUserApplications = async (token) => {
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${API_URL}/api/applications/my-applications`, config);
        return data;
    } catch (error) {
        console.error("Failed to fetch applications:", error);
        throw error;
    }
};

export const calculateApplicationStats = (applications) => {
    const completedInterviews = applications.filter(app => 
        app.videoAnalysisReport && 
        app.videoAnalysisReport.overallScore !== null &&
        app.screeningStage === 'video_completed'
    );

    return {
        total: applications.length,
        pending: applications.filter(app => app.status === 'pending').length,
        reviewed: applications.filter(app => app.status === 'reviewed').length,
        shortlisted: applications.filter(app => app.status === 'shortlisted').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
        averageScore: applications.filter(app => app.aiMatchScore !== null).length > 0
            ? Math.round(
                applications
                    .filter(app => app.aiMatchScore !== null)
                    .reduce((acc, app) => acc + app.aiMatchScore, 0) /
                applications.filter(app => app.aiMatchScore !== null).length
            )
            : 0,
        completedInterviews: completedInterviews.length,
        averageInterviewScore: completedInterviews.length > 0
            ? Math.round(
                completedInterviews.reduce((acc, app) => acc + app.videoAnalysisReport.overallScore, 0) /
                completedInterviews.length
            )
            : 0
    };
};

export const filterApplicationsByStatus = (applications, status) => {
    if (status === 'all') return applications;
    return applications.filter(app => app.status === status);
};

export const getApplicationStatusInfo = (application) => {
    const statusMap = {
        pending: { label: 'Pending', color: 'gray' },
        reviewed: { label: 'Under Review', color: 'blue' },
        shortlisted: { label: 'Shortlisted', color: 'emerald' },
        rejected: { label: 'Rejected', color: 'rose' }
    };
    
    return statusMap[application.status] || { label: 'Unknown', color: 'gray' };
};

export const getScreeningStageInfo = (application) => {
    const stageMap = {
        'quiz_pending': { label: 'Assessment Pending', action: 'Start Assessment' },
        'quiz_failed': { label: 'Assessment Failed', action: null },
        'video_pending': { label: 'Interview Pending', action: 'Start Interview' },
        'video_completed': { label: 'Interview Completed', action: 'View Analysis' }
    };
    
    return stageMap[application.screeningStage] || { label: 'Processing', action: null };
};
