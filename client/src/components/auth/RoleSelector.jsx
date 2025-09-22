import React from 'react';
import { Users, Building2 } from 'lucide-react';

const RoleSelector = ({ selectedRole, onRoleChange }) => {
    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">I am a:</label>
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => onRoleChange('candidate')}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        selectedRole === 'candidate'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                >
                    <Users className="h-5 w-5" />
                    <span className="font-medium">Job Seeker</span>
                </button>
                <button
                    type="button"
                    onClick={() => onRoleChange('employer')}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        selectedRole === 'employer'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                >
                    <Building2 className="h-5 w-5" />
                    <span className="font-medium">Employer</span>
                </button>
            </div>
        </div>
    );
};

export default RoleSelector;
