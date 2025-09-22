import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, CheckCircle, XCircle, TrendingUp, MessageSquare } from 'lucide-react';

const StatsCards = ({ stats }) => {
    const statItems = [
        {
            title: 'Total Applied',
            value: stats.total,
            icon: Briefcase,
            color: 'blue'
        },
        {
            title: 'Shortlisted',
            value: stats.shortlisted,
            icon: CheckCircle,
            color: 'emerald'
        },
        {
            title: 'Rejected',
            value: stats.rejected,
            icon: XCircle,
            color: 'rose'
        },
        {
            title: 'Avg. Match',
            value: `${stats.averageScore}%`,
            icon: TrendingUp,
            color: 'indigo'
        },
        {
            title: 'Interviews',
            value: stats.completedInterviews,
            icon: MessageSquare,
            color: 'purple'
        }
    ];

    const getColorClasses = (color) => {
        const colorMap = {
            blue: 'bg-blue-100 text-blue-600',
            emerald: 'bg-emerald-100 text-emerald-600',
            rose: 'bg-rose-100 text-rose-600',
            indigo: 'bg-indigo-100 text-indigo-600',
            purple: 'bg-purple-100 text-purple-600'
        };
        return colorMap[color] || 'bg-gray-100 text-gray-600';
    };

    return (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {statItems.map((item, index) => {
                const Icon = item.icon;
                return (
                    <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                {item.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${getColorClasses(item.color)}`}>
                                <Icon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">
                                {item.value}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default StatsCards;
