import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
      <footer className="bg-white border-t border-slate-200/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Left Side: Logo & Copyright */}
                  <div className="text-center md:text-left">
                        <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">IV</span>
                        </div>
                        <span className="font-bold text-xl text-gray-900">IntelliVibe</span>
                    </Link>
                   
                     
                  </div>

                  {/* Center: Navigation Links */}
                  <nav className="flex gap-4 sm:gap-6 text-sm font-medium text-slate-600">
                      <Link to="/jobs" className="hover:text-blue-600 transition-colors">Jobs</Link>
                      <Link to="/about" className="hover:text-blue-600 transition-colors">About Us</Link>
                      <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
                      <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
                  </nav>

                  {/* Right Side: Social Icons */}
                  <div className="flex gap-5">
                      <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors">
                          <Twitter className="h-5 w-5" />
                      </a>
                      <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors">
                          <Github className="h-5 w-5" />
                      </a>
                      <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors">
                          <Linkedin className="h-5 w-5" />
                      </a>
                  </div>
              </div>
              
          </div>
          
      </footer>
  );
};


export default Footer;