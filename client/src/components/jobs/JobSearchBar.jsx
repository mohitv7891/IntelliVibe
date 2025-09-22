import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Briefcase } from 'lucide-react';

const JobSearchBar = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 md:p-12 text-center">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6">
                    <Briefcase className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
                    Find Your Next Opportunity
                </h1>
                <p className="text-slate-600 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                    Discover AI-matched job opportunities tailored to your skills and experience. Join thousands of professionals finding their dream careers.
                </p>
                
                <div className="max-w-2xl mx-auto relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-xl"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-1.5 shadow-lg border border-white/40">
                        <div className="relative flex items-center">
                            <div className="absolute left-4 z-10">
                                <Search className="h-6 w-6 text-slate-400 group-hover:text-blue-500 transition-colors duration-200" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Search jobs, companies, locations, or skills..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-14 pr-6 h-14 text-lg border-0 bg-transparent focus:ring-0 placeholder:text-slate-400 text-slate-700 font-medium"
                            />
                            <Button 
                                size="lg" 
                                className="absolute right-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-8 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <Filter className="h-5 w-5 mr-2" />
                                Search
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobSearchBar;
