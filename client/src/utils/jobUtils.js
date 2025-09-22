import axios from 'axios';
import { toast } from 'sonner';
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173';
/**
 * Filters jobs based on search term
 * @param {Array} jobs - Array of job objects
 * @param {string} searchTerm - Search term to filter by
 * @returns {Array} Filtered array of jobs
 */
export const filterJobs = (jobs, searchTerm) => {
    if (!searchTerm.trim()) {
        return jobs;
    }

    const term = searchTerm.toLowerCase();
    return jobs.filter(job => 
        job.title.toLowerCase().includes(term) ||
        job.companyName.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term) ||
        (job.skills && job.skills.some(skill => skill.toLowerCase().includes(term)))
    );
};

/**
 * Fetches jobs from the API
 * @returns {Promise<Array>} Array of jobs
 */
export const fetchJobs = async () => {
    try {
        const { data } = await axios.get(`${BASE_URL}/api/jobs`);
        return data;
    } catch (error) {
        console.error("Failed to fetch jobs:", error);
        toast.error("Failed to load jobs. Please try again later.");
        throw error;
    }
};

/**
 * Submits a job application
 * @param {FormData} formData - Form data containing resume and jobId
 * @param {string} token - User authentication token
 * @returns {Promise<Object>} Application response
 */
export const submitJobApplication = async (formData, token) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        };
        
        const { data } = await axios.post(`${BASE_URL}/api/applications`, formData, config);
        return data;
    } catch (error) {
        console.error("Failed to submit application:", error);
        throw error;
    }
};

/**
 * Validates resume file
 * @param {File} file - Resume file to validate
 * @returns {Object} Validation result with isValid and error message
 */
export const validateResume = (file) => {
    if (!file) {
        return { isValid: false, error: 'Please upload your resume (PDF).' };
    }

    if (file.type !== 'application/pdf') {
        return { isValid: false, error: 'Please upload a PDF file.' };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        return { isValid: false, error: 'File size must be less than 5MB.' };
    }

    return { isValid: true, error: null };
};

/**
 * Formats job data for display
 * @param {Object} job - Job object
 * @returns {Object} Formatted job object
 */
export const formatJobForDisplay = (job) => {
    return {
        ...job,
        formattedPostedDate: job.postedDate ? new Date(job.postedDate).toLocaleDateString() : null,
        formattedCreatedDate: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : null,
        displaySkills: job.skills ? job.skills.slice(0, 3) : [],
        hasMoreSkills: job.skills && job.skills.length > 3,
        remainingSkillsCount: job.skills ? Math.max(0, job.skills.length - 3) : 0
    };
};

/**
 * Creates form data for job application
 * @param {File} resume - Resume file
 * @param {string} jobId - Job ID
 * @returns {FormData} Form data object
 */
export const createApplicationFormData = (resume, jobId) => {
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jobId', jobId);
    return formData;
};
