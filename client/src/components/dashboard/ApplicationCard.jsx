import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Building2, MapPin, CheckCircle, XCircle, Clock, Target, Video, BarChart2, AlertCircle, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ApplicationCard = ({ application, onShowAnalysis }) => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    const getStatusIcon = (status) => {
        switch (status) {
            case 'shortlisted':
                return <CheckCircle className="h-4 w-4 text-emerald-500" />;
            case 'rejected':
                return <XCircle className="h-4 w-4 text-rose-500" />;
            case 'reviewed':
                return <Clock className="h-4 w-4 text-blue-500" />;
            default:
                return <Clock className="h-4 w-4 text-gray-400" />;
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'shortlisted':
                return 'default';
            case 'rejected':
                return 'destructive';
            case 'reviewed':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    const getScoreBadgeVariant = (score) => {
        if (score === null || score === undefined) return 'outline';
        if (score >= 80) return 'default';
        if (score >= 60) return 'secondary';
        if (score >= 40) return 'outline';
        return 'destructive';
    };

    const renderActionButton = () => {
        if (application.screeningStage === 'quiz_pending') {
            return (
                <Button
                    className="w-full"
                    onClick={() => navigate(`/candidate/quiz/${application._id}`)}
                >
                    <Target className="h-4 w-4 mr-2" />
                    Start Assessment
                </Button>
            );
        }

        if (application.screeningStage === 'video_pending') {
            return (
                <Button
                    className="w-full"
                    onClick={() => navigate(`/candidate/interview/${application._id}`)}
                >
                    <Video className="h-4 w-4 mr-2" />
                    Start Interview
                </Button>
            );
        }

        if (application.videoInterviewCompletedAt) {
            return (
                <Button
                    className="w-full"
                    onClick={() => onShowAnalysis(application)}
                >
                    <BarChart2 className="h-4 w-4 mr-2" />
                    View Analysis
                </Button>
            );
        }

        if (application.screeningStage === 'quiz_failed') {
            return (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Assessment Failed</AlertTitle>
                    <AlertDescription>
                        You did not meet the requirements for this stage.
                    </AlertDescription>
                </Alert>
            );
        }

        return null;
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <CardTitle className="text-lg font-semibold">
                            {application.job?.title || 'Job no longer available'}
                        </CardTitle>
                        <CardDescription className="mt-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Building2 className="h-4 w-4" />
                                {application.job?.companyName || 'N/A'}
                            </div>
                            {application.job?.location && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                    <MapPin className="h-4 w-4" />
                                    {application.job.location}
                                </div>
                            )}
                        </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        {getStatusIcon(application.status)}
                        <Badge variant={getStatusBadgeVariant(application.status)}>
                            {application.status}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* AI Match Score */}
                {application.aiMatchScore !== null && application.aiMatchScore !== undefined && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-indigo-600" />
                            <span className="text-sm font-medium">AI Match</span>
                        </div>
                        <Badge variant={getScoreBadgeVariant(application.aiMatchScore)}>
                            {application.aiMatchScore}%
                        </Badge>
                    </div>
                )}

                {/* Video Interview Score */}
                {application.videoAnalysisReport && application.videoAnalysisReport.overallScore !== null && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Video className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium">Interview Score</span>
                        </div>
                        <Badge variant={getScoreBadgeVariant(application.videoAnalysisReport.overallScore)}>
                            {application.videoAnalysisReport.overallScore}%
                        </Badge>
                    </div>
                )}

                {/* Action Button */}
                <div className="pt-2">
                    {renderActionButton()}
                </div>
            </CardContent>
        </Card>
    );
};

export default ApplicationCard;
