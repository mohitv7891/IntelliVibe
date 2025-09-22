import axios from 'axios';
import * as z from 'zod';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Validation schemas
export const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z.string().min(1, { message: "Password is required." }),
});

export const registerSchema = z.object({
    firstName: z.string()
        .min(2, { message: "First name must be at least 2 characters." })
        .regex(/^[A-Za-z]+$/, { message: "First name must contain only letters." }),
    lastName: z.string()
        .min(2, { message: "Last name must be at least 2 characters." })
        .regex(/^[A-Za-z]+$/, { message: "Last name must contain only letters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters." })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
        .regex(/[0-9]/, { message: "Password must contain at least one number." })
        .regex(/[!@#$%^&*]/, { message: "Password must contain at least one special character (!@#$%^&*)." }),
    role: z.enum(["candidate", "employer"], { required_error: "You must select a role." }),
});

// API functions
export const loginUser = async (credentials) => {
    try {
        const { data } = await axios.post(`${API_URL}/api/auth/login`, credentials);
        return { success: true, data };
    } catch (error) {
        const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
        return { success: false, error: errorMessage };
    }
};

export const registerUser = async (userData) => {
    try {
        const { data } = await axios.post(`${API_URL}/api/auth/register`, userData);
        return { success: true, data };
    } catch (error) {
        const errorMessage = error.response?.data?.message || "An unexpected error occurred. Please try again.";
        return { success: false, error: errorMessage };
    }
};

// Navigation helpers
export const getRedirectPath = (role) => {
    return role === 'employer' ? '/employer/dashboard' : '/jobs';
};
