import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Video, Target, Award, AlertCircle, Mic } from 'lucide-react';

const AnalysisModal = ({ isOpen, onClose, application }) => {
    if (!application) return null;

    const getScoreBadgeVariant = (score) => {
        if (score >= 80) return 'default';
        if (score >= 60) return 'secondary';
        if (score >= 40) return 'outline';
        return 'destructive';
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Interview Analysis - {application.job?.title}
                    </DialogTitle>
                    <DialogDescription>
                        Detailed insights from your AI assessments and video interview.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* AI Match Score */}
                    {application.aiMatchScore !== null && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Brain className="h-5 w-5 text-indigo-600" />
                                    AI Resume Match
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Match Score</span>
                                    <Badge variant={getScoreBadgeVariant(application.aiMatchScore)} className="text-lg">
                                        {application.aiMatchScore}%
                                    </Badge>
                                </div>
                                {application.aiJustification && (
                                    <p className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                        {application.aiJustification}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Quiz Score */}
                    {application.quizScore !== null && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Target className="h-5 w-5 text-green-600" />
                                    Skills Assessment
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Quiz Score</span>
                                    <Badge variant={getScoreBadgeVariant(application.quizScore)} className="text-lg">
                                        {application.quizScore}%
                                    </Badge>
                                </div>
                                {application.quizResults && (
                                    <div className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                        <p>
                                            Correct: {application.quizResults.filter(r => r.isCorrect).length} / {application.quizResults.length}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Video Interview Analysis */}
                    {application.videoAnalysisReport?.overallScore !== null && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Video className="h-5 w-5 text-purple-600" />
                                    Video Interview Performance
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Overall Score</span>
                                    <Badge variant={getScoreBadgeVariant(application.videoAnalysisReport.overallScore)} className="text-lg">
                                        {application.videoAnalysisReport.overallScore}%
                                    </Badge>
                                </div>

                                {/* Detailed Scores */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <div className="font-bold text-blue-700">
                                            {application.videoAnalysisReport.communicationScore || 'N/A'}%
                                        </div>
                                        <div className="text-xs text-blue-600">Communication</div>
                                    </div>
                                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                                        <div className="font-bold text-amber-700">
                                            {application.videoAnalysisReport.technicalScore || 'N/A'}%
                                        </div>
                                        <div className="text-xs text-amber-600">Technical</div>
                                    </div>
                                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                                        <div className="font-bold text-emerald-700">
                                            {application.videoAnalysisReport.articulationScore || 'N/A'}%
                                        </div>
                                        <div className="text-xs text-emerald-600">Articulation</div>
                                    </div>
                                </div>

                                {/* Feedback */}
                                {application.videoAnalysisReport.feedback && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm font-medium text-gray-800 mb-1">AI Feedback:</p>
                                        <p className="text-sm text-gray-700">{application.videoAnalysisReport.feedback}</p>
                                    </div>
                                )}

                                {/* Red Flags */}
                                {application.videoAnalysisReport.redFlags?.length > 0 && (
                                    <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg">
                                        <p className="text-sm font-medium text-rose-800 mb-2 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            Areas for Improvement:
                                        </p>
                                        <ul className="text-sm text-rose-700 space-y-1">
                                            {application.videoAnalysisReport.redFlags.map((flag, idx) => (
                                                <li key={idx}>• {flag}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Skills Analysis */}
                                {application.skillsGapAnalysis && (
                                    <div className="space-y-3">
                                        {application.skillsGapAnalysis.matched?.length > 0 && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-800 mb-2">Matched Skills:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {application.skillsGapAnalysis.matched.map((skill, idx) => (
                                                        <Badge key={idx} variant="secondary" className="bg-emerald-100 text-emerald-800">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {application.skillsGapAnalysis.missing?.length > 0 && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-800 mb-2">Areas for Development:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {application.skillsGapAnalysis.missing.map((skill, idx) => (
                                                        <Badge key={idx} variant="outline" className="border-rose-200 text-rose-700">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AnalysisModal;
