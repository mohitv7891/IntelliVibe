import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import AuthCard from '@/components/auth/AuthCard';
import PasswordField from '@/components/auth/PasswordField';
import { loginSchema, loginUser, getRedirectPath } from '@/utils/authUtils';

const Login = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const { login } = useAuth();

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values) => {
        setIsLoading(true);
        setApiError(null);
        
        const result = await loginUser(values);
        
        if (result.success) {
            login(result.data);
            navigate(getRedirectPath(result.data.role));
        } else {
            setApiError(result.error);
        }
        
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <AuthCard 
                title="Welcome Back"
                description="Sign in to your account"
            >
                {/* Google Sign-in */}
                <GoogleSignInButton 
                    text="Continue with Google" 
                    className="w-full" 
                />
                
                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            placeholder="Enter your password"
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
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>
                </Form>

                {/* Links */}
                <div className="text-center space-y-2">
                    <Link 
                        to="/forgot-password" 
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        Forgot your password?
                    </Link>
                    <div className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link 
                            to="/register" 
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </AuthCard>
        </div>
    );
};

export default Login;
