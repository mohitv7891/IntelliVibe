import React from 'react';
import { motion } from 'framer-motion';
import { 
    ArrowRight, 
    FileScan, 
    ClipboardCheck, 
    BotMessageSquare, 
    BarChart3, 
    Users, 
    CheckCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Home = () => {
    const navigate = useNavigate();

    // Updated features based on your core functions
    const processSteps = [
        {
            icon: <FileScan className="h-8 w-8 text-blue-600" />,
            title: "1. AI Resume Screening",
            description: "Instantly screen thousands of resumes against your job description to shortlist the most qualified candidates."
        },
        {
            icon: <ClipboardCheck className="h-8 w-8 text-blue-600" />,
            title: "2. Dynamic Skill Quizzes",
            description: "Go beyond the resume. Automatically generate and send skill-based quizzes to verify candidates' expertise."
        },
        {
            icon: <BotMessageSquare className="h-8 w-8 text-blue-600" />,
            title: "3. Automated Interviews",
            description: "Conduct structured, unbiased interviews with our conversational AI, available 24/7 for candidates."
        }
    ];

    const recruiterBenefits = [
        "Reduce time-to-hire by over 70%",
        "Eliminate screening bias with objective data",
        "Focus only on top-tier, pre-vetted candidates",
        "Make confident decisions with rich analytics"
    ];

    const candidateBenefits = [
        "A fair chance to showcase practical skills",
        "Engaging and modern application experience",
        "Clear, transparent evaluation process",
        "Receive constructive feedback on performance"
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
          {/* <Header /> */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
                
                {/* Hero Section */}
                <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[200%] h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"
                    />
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900"
                    >
                        Hire Smarter, Not Harder
                        <span className="block text-blue-600 mt-2">Your AI Co-pilot for Recruitment</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto"
                    >
                        Our platform automates screening, verifies skills with custom quizzes, and conducts initial interviews, so you can focus on hiring the best talent.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="mt-10 flex items-center justify-center gap-x-6"
                    >
                        <button
                            onClick={() => navigate('/jobs')}
                            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                        >
                            Get Started
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </button>
                        <button
                            onClick={() => alert('Demo coming soon!')}
                            className="font-semibold leading-6 text-slate-700 hover:text-blue-600 transition-colors"
                        >
                            {/* Book a Demo <span aria-hidden="true">→</span> */}
                        </button>
                    </motion.div>
                </section>

                {/* How It Works Section */}
                <section className="py-20 sm:py-28">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                            A Seamless 3-Step Hiring Workflow
                        </h2>
                        <p className="mt-4 text-lg text-slate-600">
                            From application to interview, we automate the entire top-of-funnel process.
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-3">
                        {processSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                className="p-8 bg-white rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="flex items-center justify-center w-14 h-14 bg-blue-100 rounded-xl mb-6">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
                                <p className="text-slate-600">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Dual Benefits Section */}
                <section className="py-20 sm:py-28">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* For Recruiters */}
                        <motion.div
                           initial={{ opacity: 0, x: -30 }}
                           whileInView={{ opacity: 1, x: 0 }}
                           viewport={{ once: true, amount: 0.5 }}
                           transition={{ duration: 0.7 }}
                           className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/80"
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2 bg-blue-100 rounded-lg"><Users className="h-6 w-6 text-blue-600"/></div>
                                <h3 className="text-2xl font-bold text-slate-900">For Recruiters</h3>
                            </div>
                            <ul className="space-y-3">
                                {recruiterBenefits.map((benefit, i) => (
                                    <li key={i} className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                                        <span className="text-slate-600">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        {/* For Candidates */}
                        <motion.div
                           initial={{ opacity: 0, x: 30 }}
                           whileInView={{ opacity: 1, x: 0 }}
                           viewport={{ once: true, amount: 0.5 }}
                           transition={{ duration: 0.7 }}
                           className="bg-slate-800 p-8 rounded-2xl"
                        >
                             <div className="flex items-center gap-3 mb-5">
                                <div className="p-2 bg-slate-700 rounded-lg"><Users className="h-6 w-6 text-slate-100"/></div>
                                <h3 className="text-2xl font-bold text-white">For Candidates</h3>
                            </div>
                            <ul className="space-y-3">
                                {candidateBenefits.map((benefit, i) => (
                                    <li key={i} className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-sky-400 mr-3 mt-1 flex-shrink-0" />
                                        <span className="text-slate-300">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </section>

                {/* Analytics Section */}
                <section className="py-20 sm:py-28">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                           Unlock Actionable Insights
                        </h2>
                        <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
                            Finally, receive a comprehensive report for every candidate, comparing skills, performance, and culture fit at a glance.
                        </p>
                    </div>
                    <motion.div
                         initial={{ opacity: 0, scale: 0.9 }}
                         whileInView={{ opacity: 1, scale: 1 }}
                         viewport={{ once: true, amount: 0.5 }}
                         transition={{ duration: 0.7 }}
                         className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200/80 max-w-6xl mx-auto"
                    >
                        <div className="flex items-center justify-between mb-6">
                           <h4 className="font-bold text-xl text-slate-800">Candidate Analytics Dashboard</h4>
                           <BarChart3 className="h-6 w-6 text-blue-500"/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-100/70 p-4 rounded-xl text-center">
                                <p className="text-sm text-slate-500">Overall Match Score</p>
                                <p className="text-4xl font-bold text-blue-600">88%</p>
                            </div>
                            <div className="bg-slate-100/70 p-4 rounded-xl text-center">
                                <p className="text-sm text-slate-500">Technical Quiz Score</p>
                                <p className="text-4xl font-bold text-slate-800">92/100</p>
                            </div>
                             <div className="bg-slate-100/70 p-4 rounded-xl text-center">
                                <p className="text-sm text-slate-500">Communication Skills</p>
                                <p className="text-4xl font-bold text-slate-800">A+</p>
                            </div>
                        </div>
                         <div className="mt-6 p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
                            <p className="font-semibold">AI Recommendation: <span className="font-bold">Strongly Recommended for Final Round</span></p>
                         </div>
                    </motion.div>
                </section>

                {/* Final CTA Section */}
                <section className="py-30 sm:py-28">
                    <div className="text-center bg-slate-800 p-10 sm:p-16 rounded-2xl">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white">
                            Ready to Revolutionize Your Hiring?
                        </h2>
                        <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
                            Start building your dream team today. Let our AI handle the heavy lifting.
                        </p>
                        <div className="mt-10">
                             <button
                                onClick={() => navigate('/jobs')}
                                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                            >
                                Find Your Next Hire
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            {/* <Footer /> */}
        </div>
    );
};

export default Home;