import React from 'react';
import { TrendingUp, Zap } from 'lucide-react';

const JobResultsSummary = ({ filteredJobsCount, searchTerm }) => {
    return (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl">
                        <TrendingUp className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">
                            {filteredJobsCount} <span className="text-lg font-medium text-slate-600">
                                {filteredJobsCount === 1 ? 'position' : 'positions'} found
                            </span>
                        </div>
                        {searchTerm && (
                            <p className="text-slate-600">
                                Results for "<span className="font-semibold text-blue-600">{searchTerm}</span>"
                            </p>
                        )}
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
                    <Zap className="h-4 w-4" />
                    AI-powered matching
                </div>
            </div>
        </div>
    );
};

export default JobResultsSummary;
