import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardEmptyState = () => {
    return (
        <Card className="text-center py-16">
            <CardContent>
                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6">
                    <Briefcase className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No applications yet</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Start applying to jobs to track your applications and get AI-powered insights.
                </p>
                <Button asChild>
                    <Link to="/jobs">Browse Jobs</Link>
                </Button>
            </CardContent>
        </Card>
    );
};

export default DashboardEmptyState;
