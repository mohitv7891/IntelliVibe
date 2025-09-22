import React from 'react';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Briefcase, DollarSign, Clock } from 'lucide-react';
import JobApplicationDialog from './JobApplicationDialog';

// A helper function to format time in a user-friendly "time ago" format.
const timeSince = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "Just now";
};

const JobCard = ({ job, onApply }) => {
    const postedDate = new Date(job.postedDate || job.createdAt);

    return (
        <Dialog>
            {/* Added a subtle blue border on hover to hint at the theme */}
            <Card className="flex flex-col h-full overflow-hidden rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200 ease-in-out group">
                <CardContent className="p-5 flex flex-col flex-grow">
                    
                    {/* Header: Title & Company */}
                    <div className="mb-4">
                        {/* Title gets theme color on hover */}
                        <CardTitle className="text-lg font-semibold line-clamp-2 text-gray-900 group-hover:text-blue-700 transition-colors duration-200">{job.title}</CardTitle>
                        <CardDescription className="text-sm text-gray-600">{job.companyName}</CardDescription>
                    </div>

                    {/* Meta Info: Location, Salary, Type */}
                    <div className="space-y-2 text-sm text-gray-700 mb-4">
                        {job.location && (
                            <div className="flex items-center gap-2">
                                {/* Icons now use a muted theme blue */}
                                <MapPin className="h-4 w-4 text-blue-400" />
                                <span>{job.location}</span>
                            </div>
                        )}
                        {job.salary && (
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-blue-400" />
                                <span>{job.salary}</span>
                            </div>
                        )}
                        {job.jobType && (
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-blue-400" />
                                <span>{job.jobType}</span>
                            </div>
                        )}
                    </div>

                    {/* Skills Pills - now with a subtle blue tint */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills?.slice(0, 3).map(skill => (
                            <span key={skill} className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium border border-blue-100">
                                {skill}
                            </span>
                        ))}
                    </div>

                    {/* Footer: Pushes to the bottom of the card */}
                    <div className="mt-auto flex justify-between items-center pt-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{timeSince(postedDate)}</span>
                        </div>
                        <DialogTrigger asChild>
                            {/* Apply Button now uses the theme blue */}
                            <Button 
                                size="sm" 
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-colors duration-200"
                            >
                                Apply
                            </Button>
                        </DialogTrigger>
                    </div>

                </CardContent>
            </Card>
            
            <JobApplicationDialog job={job} onApply={onApply} />
        </Dialog>
    );
};

export default JobCard;