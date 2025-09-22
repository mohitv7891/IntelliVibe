import React from 'react';

const JobLoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center">
                <div className="relative mb-8">
                    <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                    <div 
                        className="absolute inset-0 rounded-full h-20 w-20 border-4 border-purple-200 border-t-purple-600 mx-auto animate-spin" 
                        style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                    ></div>
                </div>
                <p className="text-xl text-slate-700 font-medium">Discovering opportunities for you...</p>
                <p className="text-slate-500 mt-2">Our AI is finding the perfect matches</p>
            </div>
        </div>
    );
};

export default JobLoadingSpinner;
