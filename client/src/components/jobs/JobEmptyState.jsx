import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';

const JobEmptyState = ({ searchTerm, onClearSearch }) => {
    return (
        <div className="flex justify-center items-center min-h-[500px]">
            <Card className="max-w-md w-full bg-white/80 backdrop-blur-xl border-white/20 shadow-xl rounded-3xl">
                <CardContent className="text-center py-16 px-8">
                    <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mx-auto mb-6">
                        <Briefcase className="h-10 w-10 text-slate-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                        {searchTerm ? 'No Jobs Found' : 'No Open Positions'}
                    </h3>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        {searchTerm 
                            ? 'Try adjusting your search terms or browse all available positions.' 
                            : 'Please check back later for new opportunities.'
                        }
                    </p>
                    {searchTerm && (
                        <Button 
                            variant="outline" 
                            className="bg-white/60 backdrop-blur-sm border-slate-200 hover:bg-white/80 rounded-xl px-6 py-3"
                            onClick={onClearSearch}
                        >
                            View All Jobs
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default JobEmptyState;
