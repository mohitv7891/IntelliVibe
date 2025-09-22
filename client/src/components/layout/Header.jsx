import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const { userInfo, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinkClass = ({ isActive }) => 
        `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            isActive 
            ? 'bg-blue-50 text-blue-600' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`;

    const navLinks = (
        <>
            {(!userInfo || userInfo.role === 'candidate') && (
                <NavLink to="/jobs" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
                    Browse Jobs
                </NavLink>
            )}
            {userInfo?.role === 'candidate' && (
                 <NavLink to="/candidate/dashboard" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
                    My Applications
                </NavLink>
            )}
            {userInfo?.role === 'employer' && (
                <NavLink to="/employer/dashboard" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
                    Employer Dashboard
                </NavLink>
            )}
        </>
    );

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo - Reverted to the original design as requested */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">IV</span>
                        </div>
                        <span className="font-bold text-xl text-gray-900">IntelliVibe</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-2">
                        {navLinks}
                    </nav>

                    {/* Desktop Auth Section */}
                    <div className="hidden md:flex items-center">
                        {userInfo ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-20 w-20 rounded-full">
                                        <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center">
                                            <User className="h-20 w-20 " />
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    {/* === FORCEFUL FIX APPLIED HERE === */}
                                    <DropdownMenuItem 
                                        onSelect={() => navigate(userInfo.role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard')}
                                        className="text-gray-900 focus:bg-slate-100" // Explicitly setting text color
                                    >
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        <span>Dashboard</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={logout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" asChild>
                                    <Link to="/login">Login</Link>
                                </Button>
                                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                                    <Link to="/register">Sign Up</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden bg-white border-t border-slate-200/60"
                    >
                        <nav className="flex flex-col gap-2 p-4">
                            {navLinks}
                            <div className="mt-4 pt-4 border-t border-slate-200/60">
                               {userInfo ? (
                                    <div className="space-y-2">
                                        {/* === FORCEFUL FIX APPLIED HERE for mobile too === */}
                                        <Button 
                                            variant="ghost" 
                                            className="w-full justify-start text-gray-900" // Explicitly setting text color
                                            onClick={() => {navigate(userInfo.role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard'); setIsMobileMenuOpen(false);}}
                                        >
                                            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50" 
                                            onClick={() => {logout(); setIsMobileMenuOpen(false);}}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" /> Logout
                                        </Button>
                                    </div>
                                ) : (
                                     <div className="flex flex-col gap-2">
                                        <Button variant="outline" asChild className="w-full">
                                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                                        </Button>
                                        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;