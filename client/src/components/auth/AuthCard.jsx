import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

const AuthCard = ({ title, description, children }) => {
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center space-y-4">
                <div className="flex justify-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg">
                        <Brain className="h-6 w-6 text-white" />
                    </div>
                </div>
                <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">{title}</CardTitle>
                    <CardDescription className="text-gray-600">{description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {children}
            </CardContent>
        </Card>
    );
};

export default AuthCard;
