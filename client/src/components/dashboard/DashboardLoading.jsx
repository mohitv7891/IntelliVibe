import React from 'react';

const DashboardLoading = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading your applications...</p>
            </div>
        </div>
    );
};

export default DashboardLoading;
