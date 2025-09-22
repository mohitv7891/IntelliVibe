import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Building2, 
    MapPin, 
    FileText, 
    Upload, 
    Zap, 
    CheckCircle, 
    XCircle 
} from 'lucide-react';

const JobApplicationDialog = ({ job, onApply }) => {
    const [applyLoading, setApplyLoading] = useState(false);
    const [applyError, setApplyError] = useState(null);
    const [applySuccess, setApplySuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApplyLoading(true);
        setApplyError(null);
        setApplySuccess(null);
        
        const form = e.target;
        const fileInput = form.querySelector('input[type="file"]');
        const resume = fileInput.files[0];
        
        if (!resume) {
            setApplyError('Please upload your resume (PDF).');
            setApplyLoading(false);
            return;
        }

        try {
            await onApply(e, job._id);
            setApplySuccess('Application submitted successfully!');
            form.reset();
        } catch (error) {
            setApplyError(error.message || 'Failed to submit application.');
        } finally {
            setApplyLoading(false);
        }
    };

    return (
        <DialogContent className="bg-white/95 backdrop-blur-xl border-white/30 max-w-md rounded-3xl shadow-2xl">
            <DialogHeader className="border-b border-slate-100 pb-6">
                <DialogTitle className="text-2xl font-bold text-slate-900 mb-4">
                    Apply for {job.title}
                </DialogTitle>
                <div className="text-sm text-slate-600 space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg">
                            <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium">{job.companyName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-emerald-50 rounded-lg">
                            <MapPin className="h-4 w-4 text-emerald-600" />
                        </div>
                        <span>{job.location}</span>
                    </div>
                </div>
            </DialogHeader>
            
            <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
                <div className="space-y-3">
                    <Label htmlFor={`resume-${job._id}`} className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Upload Resume (PDF) *
                    </Label>
                    <div className="relative">
                        <Input 
                            id={`resume-${job._id}`} 
                            type="file" 
                            accept=".pdf"
                            required 
                            className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-xs text-blue-700 flex items-center gap-2">
                            <Zap className="h-3 w-3" />
                            Your resume will be analyzed by our AI for skill matching and compatibility assessment.
                        </p>
                    </div>
                </div>
                
                {applyError && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                        <div className="flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-rose-500" />
                            <p className="text-rose-700 text-sm font-medium">{applyError}</p>
                        </div>
                    </div>
                )}
                
                {applySuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                            <p className="text-emerald-700 text-sm font-medium">{applySuccess}</p>
                        </div>
                    </div>
                )}
                
                <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    disabled={applyLoading}
                >
                    {applyLoading ? (
                        <div className="flex items-center justify-center gap-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                            <span>Submitting Application...</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2">
                            <Upload className="h-5 w-5" />
                            Submit Application
                        </div>
                    )}
                </Button>
            </form>
        </DialogContent>
    );
};

export default JobApplicationDialog;
