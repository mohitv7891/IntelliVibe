import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
/*useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  */
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, User, Mail } from 'lucide-react';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import AuthCard from '@/components/auth/AuthCard';
import PasswordField from '@/components/auth/PasswordField';
import RoleSelector from '@/components/auth/RoleSelector';
import { registerSchema, registerUser, getRedirectPath } from '@/utils/authUtils';

const Register = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [selectedRole, setSelectedRole] = useState('candidate');

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            role: "candidate",
        },
    });

    const onSubmit = async (values) => {
        setIsLoading(true);
        setApiError(null);
        
        const result = await registerUser(values);
        
        if (result.success) {
            localStorage.setItem('userInfo', JSON.stringify(result.data));
            navigate(getRedirectPath(result.data.role));
        } else {
            setApiError(result.error);
        }
        
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <AuthCard 
                title="Create Your Account"
                description="Join the AI-powered recruitment platform"
            >
                {/* Role Selection */}
                <RoleSelector 
                    selectedRole={selectedRole}
                    onRoleChange={(role) => {
                        setSelectedRole(role);
                        form.setValue('role', role);
                    }}
                />

                {/* Google Sign-up */}
                <GoogleSignInButton 
                    text={`Continue with Google as ${selectedRole === 'candidate' ? 'Job Seeker' : 'Employer'}`}
                    className="w-full" 
                    role={selectedRole}
                />
                
                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-2 text-gray-500">Or create account with email</span>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">First Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Last Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="email" 
                                            placeholder="Enter your email"
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <PasswordField
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder="Create a secure password"
                        />

                        {/* Error Display */}
                        {apiError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-red-700">{apiError}</span>
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </form>
                </Form>

                {/* Links */}
                <div className="text-center space-y-2">
                    <div className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link 
                            to="/login" 
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                            Sign in
                        </Link>
                    </div>
                    <div className="text-xs text-gray-500">
                        By creating an account, you agree to our{' '}
                        <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                    </div>
                </div>
            </AuthCard>
        </div>
    );
};

export default Register;
