import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase } from 'lucide-react';

// Modular Components
import StatsCards from '@/components/dashboard/StatsCards';
import ApplicationCard from '@/components/dashboard/ApplicationCard';
import AnalysisModal from '@/components/dashboard/AnalysisModal';
import DashboardLoading from '@/components/dashboard/DashboardLoading';
import DashboardEmptyState from '@/components/dashboard/DashboardEmptyState';

// Utility Functions
import { 
    fetchUserApplications, 
    calculateApplicationStats, 
    filterApplicationsByStatus 
} from '@/utils/dashboardUtils';

const CandidateDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        reviewed: 0,
        shortlisted: 0,
        rejected: 0,
        averageScore: 0,
        completedInterviews: 0,
        averageInterviewScore: 0
    });
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [selectedApplicationForAnalysis, setSelectedApplicationForAnalysis] = useState(null);
    
    const { userInfo } = useAuth();

    useEffect(() => {
        loadApplications();
    }, [userInfo]);

    const loadApplications = async () => {
        if (!userInfo) return;
        
        setIsLoading(true);
        try {
            const data = await fetchUserApplications(userInfo.token);
            setApplications(data);
            setStats(calculateApplicationStats(data));
        } catch (error) {
            console.error("Failed to fetch applications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShowAnalysis = (application) => {
        setSelectedApplicationForAnalysis(application);
        setShowAnalysisModal(true);
    };

    if (isLoading) {
        return <DashboardLoading />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg">
                            <Briefcase className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                    </div>
                    <p className="text-gray-600">Track and manage your job applications</p>
                </div>

                {/* Stats Cards */}
                <div className="mb-8">
                    <StatsCards stats={stats} />
                </div>

                {/* Applications */}
                {applications.length === 0 ? (
                    <DashboardEmptyState />
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Application Status</CardTitle>
                            <CardDescription>View and manage your application progress</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="all" className="w-full">
                                <TabsList className="grid w-full grid-cols-5">
                                    <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
                                    <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                                    <TabsTrigger value="reviewed">Under Review ({stats.reviewed})</TabsTrigger>
                                    <TabsTrigger value="shortlisted">Shortlisted ({stats.shortlisted})</TabsTrigger>
                                    <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
                                </TabsList>

                                <TabsContent value="all" className="mt-6">
                                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {applications.map(app => (
                                            <ApplicationCard 
                                                key={app._id} 
                                                application={app} 
                                                onShowAnalysis={handleShowAnalysis}
                                            />
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="pending" className="mt-6">
                                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {filterApplicationsByStatus(applications, 'pending').map(app => (
                                            <ApplicationCard 
                                                key={app._id} 
                                                application={app} 
                                                onShowAnalysis={handleShowAnalysis}
                                            />
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="reviewed" className="mt-6">
                                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {filterApplicationsByStatus(applications, 'reviewed').map(app => (
                                            <ApplicationCard 
                                                key={app._id} 
                                                application={app} 
                                                onShowAnalysis={handleShowAnalysis}
                                            />
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="shortlisted" className="mt-6">
                                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {filterApplicationsByStatus(applications, 'shortlisted').map(app => (
                                            <ApplicationCard 
                                                key={app._id} 
                                                application={app} 
                                                onShowAnalysis={handleShowAnalysis}
                                            />
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="rejected" className="mt-6">
                                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {filterApplicationsByStatus(applications, 'rejected').map(app => (
                                            <ApplicationCard 
                                                key={app._id} 
                                                application={app} 
                                                onShowAnalysis={handleShowAnalysis}
                                            />
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                )}

                {/* Analysis Modal */}
                <AnalysisModal 
                    isOpen={showAnalysisModal}
                    onClose={() => setShowAnalysisModal(false)}
                    application={selectedApplicationForAnalysis}
                />
            </div>
        </div>
    );
};

export default CandidateDashboard;
