import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Modular Components
import JobSearchBar from '@/components/jobs/JobSearchBar';
import JobResultsSummary from '@/components/jobs/JobResultsSummary';
import JobLoadingSpinner from '@/components/jobs/JobLoadingSpinner';
import JobEmptyState from '@/components/jobs/JobEmptyState';
import JobCard from '@/components/jobs/JobCard';

// Utility Functions
import { filterJobs, fetchJobs, submitJobApplication, validateResume, createApplicationFormData } from '@/utils/jobUtils';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    const { userInfo } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const jobsData = await fetchJobs();
                setJobs(jobsData);
            } catch (error) {
                // Error handling is done in fetchJobs utility
            } finally {
                setIsLoading(false);
            }
        };
        loadJobs();
    }, []);

    const filteredJobs = filterJobs(jobs, searchTerm);

    // Handler for job application form submit
    const handleApply = async (e, jobId) => {
        e.preventDefault();
        const form = e.target;
        const fileInput = form.querySelector('input[type="file"]');
        const resume = fileInput.files[0];
        
        const validation = validateResume(resume);
        if (!validation.isValid) {
            throw new Error(validation.error);
        }

        const formData = createApplicationFormData(resume, jobId);
        const data = await submitJobApplication(formData, userInfo?.token);
        
            form.reset();
            // Redirect to My Applications if success
            if (data.success) {
                setTimeout(() => navigate('/candidate/dashboard'), 1200);
            }
        
        return data;
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    return (
        <>
            <div className="min-h-screen bg-white">
                <div className="relative">
                    {/* Background decorative elements */}
                    <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                    
                    <div className="relative p-6 md:p-10 space-y-8">
                        {/* Search Bar Component */}
                        <JobSearchBar 
                            searchTerm={searchTerm} 
                            onSearchChange={handleSearchChange} 
                        />
                        
                        {/* Results Summary Component */}
                        {!isLoading && (
                            <JobResultsSummary 
                                filteredJobsCount={filteredJobs.length} 
                                searchTerm={searchTerm} 
                            />
                        )}
                        
                        {/* Job Listings */}
                        {isLoading ? (
                            <JobLoadingSpinner />
                        ) : filteredJobs.length === 0 ? (
                            <JobEmptyState 
                                searchTerm={searchTerm} 
                                onClearSearch={handleClearSearch} 
                            />
                        ) : (
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {filteredJobs.map((job) => (
                                    <JobCard 
                                        key={job._id} 
                                        job={job} 
                                        onApply={handleApply} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </>
    );
};

export default Jobs;
