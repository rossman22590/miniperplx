/* eslint-disable @next/next/no-img-element */
"use client";

import { Brain, Command, GraduationCap, LineChart, Users, Zap, BookOpen, Star, Trophy, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TextLoop } from '@/components/core/text-loop';
import { TextShimmer } from '@/components/core/text-shimmer';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import NextImage from 'next/image';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function AboutPage() {
    const router = useRouter();
    const [showWelcome, setShowWelcome] = useState(false);
    
    useEffect(() => {
        // Check if user has seen the welcome message
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
        if (!hasSeenWelcome) {
            setShowWelcome(true);
        }
    }, []);

    const handleDismissWelcome = () => {
        setShowWelcome(false);
        localStorage.setItem('hasSeenWelcome', 'true');
    };

    const handleGetStarted = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push('/');
    };
    

    return (
        <div className="min-h-screen bg-background overflow-hidden">
            <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
                <DialogContent className="sm:max-w-[425px] p-0 bg-neutral-50 dark:bg-neutral-900">
                    <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-pink-600 dark:text-pink-500">
                                <Zap className="h-5 w-5" />
                                Welcome to DataVibes
                            </DialogTitle>
                            <DialogDescription className="text-neutral-600 dark:text-neutral-400">
                                The ultimate AI tutor platform for data science and machine learning. Start your learning journey today!
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <DialogFooter className="p-6 pt-4">
                        <Button 
                            variant="default" 
                            onClick={handleDismissWelcome}
                            className="w-full bg-pink-600 dark:bg-pink-500 text-white hover:bg-pink-700 dark:hover:bg-pink-600"
                        >
                            Let&apos;s Get Started
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Hero Section */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-pink-100/40 dark:from-pink-900/40" />
                <div className="absolute inset-0 bg-grid-pink-700/[0.05] dark:bg-grid-pink-300/[0.05]" />
                <div className="relative pt-20 pb-20 px-4">
                    <motion.div 
                        className="container max-w-5xl mx-auto space-y-12"
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        {/* Company Name/Logo */}
                        <motion.div variants={item} className="text-center">
                            <Link href="/" className="inline-flex items-end gap-3 text-5xl font-syne font-bold">
                                <NextImage src="https://img.mytsi.org/i/lP72916.png" alt="DataVibes Logo" className="h-16 w-16" width={64} height={64} unoptimized quality={100}/>
                                <span className='bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600'>DataVibes</span>
                            </Link>
                        </motion.div>

                        {/* <motion.form 
                            variants={item} 
                            className="max-w-2xl mx-auto w-full"
                            onSubmit={handleGetStarted}
                        >
                            <div className="relative group">
                                <input
                                    type="text"
                                    name="topic"
                                    placeholder="What would you like to learn today?"
                                    className="w-full h-14 px-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-pink-300 dark:focus:border-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-700 transition-all duration-300"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-2 h-10 px-4 rounded-xl bg-pink-600 dark:bg-pink-500 text-white font-medium hover:bg-pink-700 dark:hover:bg-pink-600 transition-opacity"
                                >
                                    Start Learning
                                </button>
                            </div>
                        </motion.form> */}

                        <motion.div variants={item} className="text-center space-y-6">
                            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                                The leading AI tutor platform that makes learning data science, machine learning, and LLMs intuitive and personalized.
                            </p>
                        </motion.div>

                        <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href="/"
                                className="group relative inline-flex h-12 items-center gap-2 px-6 rounded-xl bg-pink-600 dark:bg-pink-500 text-white hover:bg-pink-700 dark:hover:bg-pink-600 transition-all duration-300"
                            >
                                <GraduationCap className="h-5 w-5" />
                                <span className="font-medium">Start Learning</span>
                            </Link>
                            <Link
                                href="/about"
                                className="group relative inline-flex h-12 items-center gap-2 px-6 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-300"
                            >
                                <span className="font-medium">Learn More</span>
                                <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 16 16" fill="none">
                                    <path d="M6.66667 12.6667L11.3333 8.00004L6.66667 3.33337" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Learning Simulation */}
            <div className="py-24 px-4 bg-white dark:bg-black border-y border-neutral-200 dark:border-neutral-800">
                <motion.div 
                    className="container max-w-5xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl font-bold">Personalized Learning Experience</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            See how DataVibes adapts to your learning style and provides tailored guidance for mastering complex concepts.
                        </p>
                    </div>

                    <div className="relative max-w-2xl mx-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-8 space-y-8">
                        {/* Student Query */}
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <p className="text-sm text-neutral-500">Student</p>
                                <p className="text-neutral-900 dark:text-neutral-100">
                                    Can you explain how neural networks learn through backpropagation? I&apos;m struggling with the math.
                                </p>
                            </div>
                        </div>

                        {/* Processing */}
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900 flex-shrink-0 flex items-center justify-center">
                                <Brain className="w-4 h-4 text-pink-500" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="space-y-2">
                                    <p className="text-sm text-neutral-500">Analyzing your learning style</p>
                                    <TextLoop interval={1.5}>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                            🧠 Identifying knowledge gaps...
                                        </p>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                            📊 Adapting to visual learning preference...
                                        </p>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                            🔍 Finding best examples for your level...
                                        </p>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                            ✏️ Preparing step-by-step explanation...
                                        </p>
                                    </TextLoop>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-neutral-500">Crafting personalized response</p>
                                    <TextShimmer className="text-sm font-medium">
                                        Creating visual and mathematical explanation tailored to your background...
                                    </TextShimmer>
                                </div>
                            </div>
                        </div>

                        {/* Response Preview */}
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex-shrink-0 flex items-center justify-center">
                                <GraduationCap className="w-4 h-4 text-green-500" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <p className="text-sm text-neutral-500">AI Tutor Response</p>
                                <div className="prose prose-sm dark:prose-invert">
                                    <p className="text-neutral-900 dark:text-neutral-100">
                                        Let&apos;s break down backpropagation step by step with a visual approach. Think of a neural network as a series of transformations...
                                    </p>
                                    <div className="text-xs text-pink-500 mt-2">
                                        Interactive diagrams and practice exercises available
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Created By Section */}
            <div className="py-24 px-4 bg-white dark:bg-black border-y border-neutral-200 dark:border-neutral-800">
                <motion.div 
                    className="container max-w-5xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                            <img 
                                src="https://img.mytsi.org/i/8GSn971.jpg" 
                                alt="Ross Cohen, Founder of Tech in Schools Initiative" 
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold">Meet the Founder</h2>
                            <p className="text-lg text-neutral-600 dark:text-neutral-400">
                                Tech in Schools Initiative, created DataVibes after seeing students struggle with data science concepts. Our vision was to build an AI tutor that adapts to each student&apos;s learning style.
                            </p>
                            <p className="text-lg text-neutral-600 dark:text-neutral-400">
                                &quot;We wanted to create a platform that makes complex topics accessible to everyone, regardless of their background. DataVibes uses the latest LLM technology to provide personalized learning experiences that traditional education can&apos;t match.&quot;
                            </p>
                            <div className="pt-4">
                                <Link
                                    href="https://myapps.ai"
                                    className="inline-flex items-center gap-2 text-pink-600 dark:text-pink-500 font-medium hover:opacity-80 transition-opacity"
                                >
                                    Learn more about our story
                                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                                        <path d="M6.66667 12.6667L11.3333 8.00004L6.66667 3.33337" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Stats Section */}
            <div className="py-24 px-4 bg-white dark:bg-black border-y border-neutral-200 dark:border-neutral-800">
                <motion.div 
                    className="container max-w-5xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center space-y-2">
                            <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-pink-400 dark:from-pink-500 dark:to-pink-300">
                                500K+
                            </div>
                            <p className="text-neutral-600 dark:text-neutral-400">Active Students</p>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-pink-400 dark:from-pink-500 dark:to-pink-300">
                                98%
                            </div>
                            <p className="text-neutral-600 dark:text-neutral-400">Student Satisfaction</p>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-pink-400 dark:from-pink-500 dark:to-pink-300">
                                25+
                            </div>
                            <p className="text-neutral-600 dark:text-neutral-400">Course Topics</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Integration Section */}
            <div className="py-24 px-4">
                <motion.div 
                    className="container max-w-5xl mx-auto space-y-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold">Powered By Advanced AI Models</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            DataVibes leverages state-of-the-art language models to provide the most effective learning experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="font-semibold">GPT-4o</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">Powers our natural language understanding and explanations</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="font-semibold">Claude 3.5</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">Handles complex reasoning and step-by-step guidance</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="font-semibold">Gemini Pro</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">Specializes in multimodal learning with visuals</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="font-semibold">Custom Models</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">Fine-tuned specifically for educational contexts</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Features Section */}
            <div className="py-24 px-4 bg-neutral-50 dark:bg-neutral-900/50">
                <motion.div 
                    className="container max-w-5xl mx-auto space-y-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold">Why Students Love DataVibes</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            Our platform is designed to make learning data science and AI concepts intuitive and engaging.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { 
                                icon: Brain, 
                                title: "Adaptive Learning",
                                description: "Adjusts to your learning style and pace for optimal understanding" 
                            },
                            { 
                                icon: LineChart, 
                                title: "Interactive Visualizations",
                                description: "Complex concepts explained through dynamic, interactive diagrams" 
                            },
                            { 
                                icon: Command, 
                                title: "Hands-on Coding",
                                description: "Practice with real-time feedback and guidance" 
                            },
                            { 
                                icon: BookOpen, 
                                title: "Comprehensive Curriculum",
                                description: "From basics to advanced topics in data science and ML" 
                            },
                            { 
                                icon: Users, 
                                title: "Community Learning",
                                description: "Connect with peers and participate in group challenges" 
                            },
                            { 
                                icon: Zap, 
                                title: "Instant Feedback",
                                description: "Get immediate help when you're stuck on a concept" 
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                className="group relative p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-pink-300 dark:hover:border-pink-700 transition-all duration-300"
                                whileHover={{ y: -4 }}
                            >
                                <div className="space-y-4">
                                    <div className="p-2.5 w-fit rounded-xl bg-pink-100 dark:bg-pink-900/30">
                                        <feature.icon className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                                        <p className="text-neutral-600 dark:text-neutral-400">{feature.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Course Topics Section */}
            <div className="py-24 px-4 bg-white dark:bg-black border-y border-neutral-200 dark:border-neutral-800">
                <motion.div className="container max-w-5xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold">Explore Our Course Topics</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            From foundational concepts to cutting-edge techniques, we cover the full spectrum of data science and AI.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="text-lg font-semibold mb-2">Data Science Fundamentals</h3>
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
                                <li>Statistics & Probability</li>
                                <li>Data Visualization</li>
                                <li>Exploratory Data Analysis</li>
                                <li>SQL & Database Concepts</li>
                            </ul>
                        </div>
                        <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="text-lg font-semibold mb-2">Machine Learning</h3>
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
                                <li>Supervised & Unsupervised Learning</li>
                                <li>Feature Engineering</li>
                                <li>Model Evaluation</li>
                                <li>Deep Learning Fundamentals</li>
                            </ul>
                        </div>
                        <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="text-lg font-semibold mb-2">Advanced AI Topics</h3>
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
                                <li>Large Language Models</li>
                                <li>Computer Vision</li>
                                <li>Reinforcement Learning</li>
                                <li>AI Ethics & Responsible AI</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Testimonial Section */}
            <div className="py-24 px-4 bg-neutral-50 dark:bg-neutral-900/50">
                <motion.div 
                    className="container max-w-5xl mx-auto space-y-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold">What Our Students Say</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            Join thousands of satisfied learners who&apos;ve transformed their understanding of data science.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <div className="flex items-center gap-2 mb-4">
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                            </div>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                                &quot;DataVibes helped me understand neural networks in a way no textbook ever could. The interactive visualizations made complex concepts click for me.&quot;
                            </p>
                            <p className="font-semibold">Sarah K., Data Scientist</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <div className="flex items-center gap-2 mb-4">
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                            </div>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                                &quot;I was struggling with statistics until I found DataVibes. The personalized approach and patient explanations made all the difference.&quot;
                            </p>
                            <p className="font-semibold">Michael T., Student</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <div className="flex items-center gap-2 mb-4">
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                            </div>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                                &quot;As someone transitioning careers, DataVibes was instrumental in helping me master machine learning concepts quickly and effectively.&quot;
                            </p>
                            <p className="font-semibold">Jennifer L., Software Engineer</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* CTA Section */}
            <div className="py-24 px-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
                <motion.div 
                    className="container max-w-5xl mx-auto text-center space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl font-bold">Start Your Learning Journey Today</h2>
                    <p className="text-xl max-w-2xl mx-auto text-pink-100">
                        Join over 500,000 students who are mastering data science and AI with personalized guidance.
                    </p>
                    <div className="pt-4">
                        <Link
                            href="https://myapps.ai/"
                            className="inline-flex h-14 items-center gap-2 px-8 rounded-xl bg-white text-pink-600 font-medium hover:bg-pink-50 transition-all duration-300"
                        >
                            <span className="font-medium">Get Started Free</span>
                            <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 16 16" fill="none">
                            <path d="M6.66667 12.6667L11.3333 8.00004L6.66667 3.33337" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </Link>
                    </div>
                    <p className="text-sm text-pink-200">No credit card required. Start with our free plan today.</p>
                </motion.div>
            </div>

            {/* Awards Section */}
            <div className="py-24 px-4 bg-white dark:bg-black border-y border-neutral-200 dark:border-neutral-800">
                <motion.div 
                    className="container max-w-5xl mx-auto space-y-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold">Award-Winning Platform</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            Recognized for innovation in AI education and learning technology.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <div className="flex items-center gap-4 mb-4">
                                <Trophy className="h-8 w-8 text-yellow-500" />
                                <div>
                                    <h3 className="font-semibold">Best EdTech Platform</h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">EdTech Breakthrough Awards 2024</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <div className="flex items-center gap-4 mb-4">
                                <Star className="h-8 w-8 text-pink-500" />
                                <div>
                                    <h3 className="font-semibold">AI Innovation Award</h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Tech for Good Summit 2023</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <div className="flex items-center gap-4 mb-4">
                                <Users className="h-8 w-8 text-green-500" />
                                <div>
                                    <h3 className="font-semibold">Most Inclusive Learning Platform</h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Global Learning Initiative 2024</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Pricing Section */}
            {/* <div className="py-24 px-4 bg-neutral-50 dark:bg-neutral-900/50">
                <motion.div 
                    className="container max-w-5xl mx-auto space-y-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold">Simple, Transparent Pricing</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            Choose the plan that fits your learning needs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold">Free</h3>
                                <div className="flex items-end gap-1">
                                    <span className="text-4xl font-bold">$0</span>
                                    <span className="text-neutral-600 dark:text-neutral-400">/month</span>
                                </div>
                                <p className="text-neutral-600 dark:text-neutral-400 pb-4">Perfect for beginners exploring data science.</p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="h-3 w-3 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>Access to basic courses</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="h-3 w-3 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>5 AI tutor questions per day</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="h-3 w-3 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>Community forum access</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-8">
                                <Link
                                    href="/signup"
                                    className="block w-full py-3 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-center font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                        
                        <div className="p-8 rounded-2xl bg-pink-600 text-white border border-pink-500 relative">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-pink-700 text-white text-sm font-medium py-1 px-3 rounded-full">
                                Most Popular
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold">Pro</h3>
                                <div className="flex items-end gap-1">
                                    <span className="text-4xl font-bold">$19</span>
                                    <span className="text-pink-200">/month</span>
                                </div>
                                <p className="text-pink-100 pb-4">For serious learners who want to master data science.</p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <div className="h-5 w-5 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>All Free features</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="h-5 w-5 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>Unlimited AI tutor questions</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="h-5 w-5 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>All advanced courses</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="h-5 w-5 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>Interactive coding exercises</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="h-5 w-5 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>Progress tracking</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-8">
                                <Link
                                    href="/signup-pro"
                                    className="block w-full py-3 px-4 rounded-xl bg-white text-pink-600 text-center font-medium hover:bg-pink-50 transition-colors"
                                >
                                    Get Pro
                                </Link>
                            </div>
                        </div>
                        
                        <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold">Enterprise</h3>
                                <div className="flex items-end gap-1">
                                    <span className="text-4xl font-bold">Custom</span>
                                </div>
                                <p className="text-neutral-600 dark:text-neutral-400 pb-4">For organizations training multiple team members.</p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="h-3 w-3 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>All Pro features</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="h-3 w-3 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>Custom curriculum development</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="h-3 w-3 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>Team analytics dashboard</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="h-3 w-3 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>Dedicated support manager</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-8">
                                <Link
                                    href="/contact-sales"
                                    className="block w-full py-3 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-center font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                                >
                                    Contact Sales
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div> */}

            {/* Final CTA Section */}
            <div className="py-24 px-4 bg-white dark:bg-black">
                <motion.div 
                    className="container max-w-4xl mx-auto text-center space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl font-bold">Ready to Transform Your Learning Experience?</h2>
                    <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                        Join DataVibes today and experience the future of data science education with our AI-powered learning platform.
                    </p>
                    <div className="pt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            href="/signup"
                            className="inline-flex h-14 items-center gap-2 px-8 rounded-xl bg-pink-600 dark:bg-pink-500 text-white font-medium hover:bg-pink-700 dark:hover:bg-pink-600 transition-all duration-300"
                        >
                            <span className="font-medium">Get Started Free</span>
                        </Link>
                        {/* <Link
                            href="/demo"
                            className="inline-flex h-14 items-center gap-2 px-8 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-300"
                        >
                            <span className="font-medium">Watch Demo</span>
                        </Link> */}
                    </div>
                </motion.div>
            </div>

            {/* Footer Section */}
            <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
                <div className="mx-auto max-w-5xl px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <Link href="/" className="inline-flex items-center gap-2">
                                <img src="https://img.mytsi.org/i/lP72916.png" alt="DataVibes Logo" className="h-8 w-8" />
                                <span className="font-bold text-xl">DataVibes</span>
                            </Link>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                The leading AI tutor platform for data science and machine learning.
                            </p>
                        </div>
{/*                         
                        <div className="space-y-4">
                            <h3 className="font-semibold">Platform</h3>
                            <ul className="space-y-2">
                                <li><Link href="/courses" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-pink-600 dark:hover:text-pink-500">Courses</Link></li>
                                <li><Link href="/pricing" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-pink-600 dark:hover:text-pink-500">Pricing</Link></li>
                                <li><Link href="/testimonials" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-pink-600 dark:hover:text-pink-500">Testimonials</Link></li>
                                <li><Link href="/enterprise" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-pink-600 dark:hover:text-pink-500">Enterprise</Link></li>
                            </ul>
                        </div> */}
                        
                        {/* <div className="space-y-4">
                            <h3 className="font-semibold">Company</h3>
                            <ul className="space-y-2">
                                <li><Link href="/about" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-pink-600 dark:hover:text-pink-500">About Us</Link></li>
                                <li><Link href="/careers" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-pink-600 dark:hover:text-pink-500">Careers</Link></li>
                                <li><Link href="/blog" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-pink-600 dark:hover:text-pink-500">Blog</Link></li>
                                <li><Link href="/contact" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-pink-600 dark:hover:text-pink-500">Contact</Link></li>
                            </ul>
                        </div> */}
{/*                         
                        <div className="space-y-4">
                            <h3 className="font-semibold">Legal</h3>
                            <ul className="space-y-2">
                                <li><Link href="/privacy" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-pink-600 dark:hover:text-pink-500">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-pink-600 dark:hover:text-pink-500">Terms of Service</Link></li>
                                <li><Link href="/cookies" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-pink-600 dark:hover:text-pink-500">Cookie Policy</Link></li>
                            </ul> */}
                        </div>
               
                    
                    <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            © {new Date().getFullYear()} AI Tutor, Inc. All rights reserved.
                        </p>
                        
                        <div className="flex items-center gap-4">
                            <Link href="https://x.com/myaitutor" className="text-neutral-600 dark:text-neutral-400 hover:text-pink-600 dark:hover:text-pink-500">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </Link>
                            {/* <Link href="https://linkedin.com/company/datavibes" className="text-neutral-600 dark:text-neutral-400 hover:text-pink-600 dark:hover:text-pink-500">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                </svg>
                            </Link>
                            <Link href="https://youtube.com/datavibes" className="text-neutral-600 dark:text-neutral-400 hover:text-pink-600 dark:hover:text-pink-500">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                                </svg>
                            </Link> */}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
// /* eslint-disable @next/next/no-img-element */
// "use client";

// import { GithubLogo, XLogo } from '@phosphor-icons/react';
// import { Bot, Brain, Command, GraduationCap, Image, Search, Share2, Sparkles, Star, Trophy, Users, AlertTriangle, Github, Twitter } from 'lucide-react';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { TextLoop } from '@/components/core/text-loop';
// import { TextShimmer } from '@/components/core/text-shimmer';
// import { Check } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { VercelLogo } from '@/components/logos/vercel-logo';
// import { TavilyLogo } from '@/components/logos/tavily-logo';
// import NextImage from 'next/image';

// const container = {
//     hidden: { opacity: 0 },
//     show: {
//         opacity: 1,
//         transition: {
//             staggerChildren: 0.1
//         }
//     }
// };

// const item = {
//     hidden: { opacity: 0, y: 20 },
//     show: { opacity: 1, y: 0 }
// };

// export default function AboutPage() {
//     const router = useRouter();
//     const [showWarning, setShowWarning] = useState(false);
    
//     useEffect(() => {
//         // Check if user has seen the warning
//         const hasSeenWarning = localStorage.getItem('hasSeenWarning');
//         if (!hasSeenWarning) {
//             setShowWarning(true);
//         }
//     }, []);

//     const handleDismissWarning = () => {
//         setShowWarning(false);
//         localStorage.setItem('hasSeenWarning', 'true');
//     };

//     const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         const formData = new FormData(e.currentTarget);
//         const query = formData.get('query')?.toString();
//         if (query) {
//             router.push(`/?q=${encodeURIComponent(query)}`);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-background overflow-hidden">
//             <Dialog open={showWarning} onOpenChange={setShowWarning}>
//                 <DialogContent className="sm:max-w-[425px] p-0 bg-neutral-50 dark:bg-neutral-900">
//                     <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
//                         <DialogHeader>
//                             <DialogTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
//                                 <AlertTriangle className="h-5 w-5" />
//                                 Warning
//                             </DialogTitle>
//                             <DialogDescription className="text-neutral-600 dark:text-neutral-400">
//                                 Scira is an AI search engine and is not associated with any cryptocurrency, memecoin, or token activities. Beware of impersonators.
//                             </DialogDescription>
//                         </DialogHeader>
//                     </div>
//                     <DialogFooter className="p-6 pt-4">
//                         <Button 
//                             variant="default" 
//                             onClick={handleDismissWarning}
//                             className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200"
//                         >
//                             Got it, thanks
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             {/* Hero Section */}
//             <div className="relative">
//                 <div className="absolute inset-0 bg-gradient-to-b from-neutral-100/40 dark:from-neutral-900/40" />
//                 <div className="absolute inset-0 bg-grid-neutral-700/[0.05] dark:bg-grid-neutral-300/[0.05]" />
//                 <div className="relative pt-20 pb-20 px-4">
//                     <motion.div 
//                         className="container max-w-5xl mx-auto space-y-12"
//                         variants={container}
//                         initial="hidden"
//                         animate="show"
//                     >
//                         {/* Company Name/Logo */}
//                         <motion.div variants={item} className="text-center">
//                             <Link href="/" className="inline-flex items-end gap-3 text-5xl font-syne font-bold">
//                                 <NextImage src="/scira.png" alt="Scira Logo" className="h-16 w-16 invert dark:invert-0" width={64} height={64} unoptimized quality={100}/>
//                                 <span className=''>Scira</span>
//                             </Link>
//                         </motion.div>

//                         <motion.form 
//                             variants={item} 
//                             className="max-w-2xl mx-auto w-full"
//                             onSubmit={handleSearch}
//                         >
//                             <div className="relative group">
//                                 <input
//                                     type="text"
//                                     name="query"
//                                     placeholder="Ask anything..."
//                                     className="w-full h-14 px-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-300 dark:focus:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700 transition-all duration-300"
//                                     onKeyDown={(e) => {
//                                         if (e.key === 'Enter') {
//                                             e.preventDefault();
//                                             const query = e.currentTarget.value;
//                                             if (query) {
//                                                 router.push(`/?q=${encodeURIComponent(query)}`);
//                                             }
//                                         }
//                                     }}
//                                 />
//                                 <button
//                                     type="submit"
//                                     className="absolute right-2 top-2 h-10 px-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:opacity-90 transition-opacity"
//                                 >
//                                     Ask Scira
//                                 </button>
//                             </div>
//                         </motion.form>

//                         <motion.div variants={item} className="text-center space-y-6">
//                             <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
//                                 A minimalistic AI-powered search engine with RAG and search grounding capabilities. Open source and built for everyone.
//                             </p>
//                         </motion.div>

//                         <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-4">
//                             <Link
//                                 href="https://git.new/scira"
//                                 className="group relative inline-flex h-12 items-center gap-2 px-6 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 transition-all duration-300"
//                             >
//                                 <GithubLogo weight="fill" className="h-5 w-5" />
//                                 <span className="font-medium">View Source</span>
//                             </Link>
//                             <Link
//                                 href="/"
//                                 className="group relative inline-flex h-12 items-center gap-2 px-6 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-300"
//                             >
//                                 <span className="font-medium">Try Now</span>
//                                 <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 16 16" fill="none">
//                                     <path d="M6.66667 12.6667L11.3333 8.00004L6.66667 3.33337" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                                 </svg>
//                             </Link>
//                         </motion.div>
//                     </motion.div>
//                 </div>
//             </div>

//             {/* Search Simulation */}
//             <div className="py-24 px-4 bg-white dark:bg-black border-y border-neutral-200 dark:border-neutral-800">
//                 <motion.div 
//                     className="container max-w-5xl mx-auto"
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                 >
//                     <div className="text-center space-y-4 mb-16">
//                         <h2 className="text-3xl font-bold">RAG & Search Grounding</h2>
//                         <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
//                             Watch how Scira combines RAG and search grounding to deliver accurate, up-to-date answers from reliable sources.
//                         </p>
//                     </div>

//                     <div className="relative max-w-2xl mx-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-8 space-y-8">
//                         {/* Query */}
//                         <div className="flex items-start gap-4">
//                             <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex-shrink-0" />
//                             <div className="flex-1 space-y-2">
//                                 <p className="text-sm text-neutral-500">Query</p>
//                                 <p className="text-neutral-900 dark:text-neutral-100">
//                                     Explain quantum computing and its real-world applications
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Processing */}
//                         <div className="flex items-start gap-4">
//                             <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex-shrink-0 flex items-center justify-center">
//                                 <Bot className="w-4 h-4 text-blue-500" />
//                             </div>
//                             <div className="flex-1 space-y-4">
//                                 <div className="space-y-2">
//                                     <p className="text-sm text-neutral-500">Processing with</p>
//                                     <TextLoop interval={1.5}>
//                                         <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
//                                             🔍 Retrieving relevant information...
//                                         </p>
//                                         <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
//                                             📚 Processing search results...
//                                         </p>
//                                         <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
//                                             🤖 Generating response...
//                                         </p>
//                                         <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
//                                             ✨ Enhancing with context...
//                                         </p>
//                                     </TextLoop>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <p className="text-sm text-neutral-500">Generating response</p>
//                                     <TextShimmer className="text-sm font-medium">
//                                         Combining insights from multiple sources for a comprehensive answer...
//                                     </TextShimmer>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Response Preview */}
//                         <div className="flex items-start gap-4">
//                             <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex-shrink-0 flex items-center justify-center">
//                                 <Check className="w-4 h-4 text-green-500" />
//                             </div>
//                             <div className="flex-1 space-y-2">
//                                 <p className="text-sm text-neutral-500">Response Preview</p>
//                                 <div className="prose prose-sm dark:prose-invert">
//                                     <p className="text-neutral-900 dark:text-neutral-100">
//                                         Quantum computing is a revolutionary technology that harnesses quantum mechanics to solve complex problems...
//                                     </p>
//                                     <div className="text-xs text-neutral-500 mt-2">
//                                         Sources: Nature Physics, IBM Research, MIT Technology Review
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>

//             {/* Powered By Section */}
//             <div className="py-24 px-4 bg-white dark:bg-black border-y border-neutral-200 dark:border-neutral-800">
//                 <motion.div 
//                     className="container max-w-5xl mx-auto space-y-16"
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                 >
//                     <div className="text-center space-y-4">
//                         <h2 className="text-3xl font-bold">Powered By</h2>
//                         <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
//                             Built with cutting-edge technology from industry leaders
//                         </p>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center gap-4">
//                             <VercelLogo />
//                             <p className="text-neutral-600 dark:text-neutral-400 text-center">
//                                 Powered by Vercel&apos;s AI SDK
//                             </p>
//                         </div>
//                         <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center gap-4">
//                             <TavilyLogo />
//                             <p className="text-neutral-600 dark:text-neutral-400 text-center">
//                                 Search grounding powered by Tavily AI
//                             </p>
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>

//             {/* Stats Section */}
//             <div className="py-24 px-4 bg-white dark:bg-black border-y border-neutral-200 dark:border-neutral-800">
//                 <motion.div 
//                     className="container max-w-5xl mx-auto"
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                 >
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                         <div className="text-center space-y-2">
//                             <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400">
//                                 1M+
//                             </div>
//                             <p className="text-neutral-600 dark:text-neutral-400">Questions Answered</p>
//                         </div>
//                         <div className="text-center space-y-2">
//                             <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400">
//                                 100K+
//                             </div>
//                             <p className="text-neutral-600 dark:text-neutral-400">Active Users</p>
//                         </div>
//                         <div className="text-center space-y-2">
//                             <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400">
//                                 7K+
//                             </div>
//                             <p className="text-neutral-600 dark:text-neutral-400">Community Stars</p>
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>

//             {/* Highlight Section */}
//             <div className="py-24 px-4 bg-white dark:bg-neutral-900/50">
//                 <motion.div 
//                     className="container max-w-5xl mx-auto"
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                 >
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//                         <div className="space-y-6">
//                             <h2 className="text-3xl font-bold">Featured on Vercel&apos;s Blog</h2>
//                             <p className="text-lg text-neutral-600 dark:text-neutral-400">
//                                 Recognized for our innovative use of AI technology and contribution to the developer community through the Vercel AI SDK.
//                             </p>
//                             <Link
//                                 href="https://vercel.com/blog/ai-sdk-4-1"
//                                 className="inline-flex items-center gap-2 text-neutral-900 dark:text-white font-medium hover:opacity-80 transition-opacity"
//                             >
//                                 Read the Feature
//                                 <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
//                                     <path d="M6.66667 12.6667L11.3333 8.00004L6.66667 3.33337" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                                 </svg>
//                             </Link>
//                         </div>
//                         <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
//                             <img 
//                                 src="/vercel-featured.png" 
//                                 alt="Featured on Vercel Blog" 
//                                 className="object-cover w-full h-full"
//                             />
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>

//             {/* Integration Section - Add before Use Cases */}
//             <div className="py-24 px-4">
//                 <motion.div 
//                     className="container max-w-5xl mx-auto space-y-16"
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                 >
//                     <div className="text-center space-y-4">
//                         <h2 className="text-3xl font-bold">Powered By Advanced Language Models</h2>
//                         <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
//                             Each model is carefully selected for its unique strengths in understanding and processing information.
//                         </p>
//                     </div>

//                     <div className="flex flex-col sm:flex-row flex-wrap justify-center items-stretch gap-6">
//                         <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 w-full sm:w-[calc(50%-12px)] lg:w-[280px]">
//                             <h3 className="font-semibold">Grok 3.0</h3>
//                             <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">xAI&apos;s most intelligent model</p>
//                         </div>
//                         <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 w-full sm:w-[calc(50%-12px)] lg:w-[280px]">
//                             <h3 className="font-semibold">Grok 3.0 Mini</h3>
//                             <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">xAI&apos;s most efficient model</p>
//                         </div>
//                         <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 w-full sm:w-[calc(50%-12px)] lg:w-[280px]">
//                             <h3 className="font-semibold">Grok 2.0 Vision</h3>
//                             <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">xAI&apos;s most advanced vision model</p>
//                         </div>
//                         <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 w-full sm:w-[calc(50%-12px)] lg:w-[280px]">
//                             <h3 className="font-semibold">OpenAI GPT 4.1 Mini</h3>
//                             <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">OpenAI&apos;s smartest mini model</p>
//                         </div>
//                         <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 w-full sm:w-[calc(50%-12px)] lg:w-[280px]">
//                             <h3 className="font-semibold">Qwen QWQ 32B</h3>
//                             <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">Alibaba&apos;s most advanced model</p>
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>

//             {/* Testimonial Section - Add before CTA */}
//             <div className="py-20 px-4 bg-white dark:bg-black border-y border-neutral-200 dark:border-neutral-800">
//                 <motion.div 
//                     className="container max-w-5xl mx-auto space-y-12"
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                 >
//                     <div className="text-center space-y-3">
//                         <h2 className="text-3xl font-bold">Community Recognition</h2>
//                         <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
//                             Join the growing community of developers and researchers using Scira.
//                         </p>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
//                             <div className="flex items-center gap-4">
//                                 <img src="/Winner-Medal-Weekly.svg" alt="Award" className="h-10 w-10" />
//                                 <div className="space-y-1">
//                                     <h3 className="font-semibold">#3 Project of the Week</h3>
//                                     <p className="text-sm text-neutral-600 dark:text-neutral-400">Peerlist</p>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
//                             <div className="flex items-center gap-4">
//                                 <GithubLogo weight="fill" className="h-10 w-10" />
//                                 <div className="space-y-1">
//                                     <h3 className="font-semibold">7,000+ Stars</h3>
//                                     <p className="text-sm text-neutral-600 dark:text-neutral-400">GitHub</p>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
//                             <div className="flex items-center gap-4">
//                                 <Users className="h-10 w-10" />
//                                 <div className="space-y-1">
//                                     <h3 className="font-semibold">100K+ Monthly Users</h3>
//                                     <p className="text-sm text-neutral-600 dark:text-neutral-400">Active Community</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>

//             {/* Features Section */}
//             <div className="py-24 px-4">
//                 <motion.div 
//                     className="container max-w-5xl mx-auto space-y-16"
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                 >
//                     <div className="text-center space-y-4">
//                         <h2 className="text-3xl font-bold">Advanced Search Features</h2>
//                         <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
//                             Experience a smarter way to search with AI-powered features that understand your queries better.
//                         </p>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                         {[
//                             { 
//                                 icon: Brain, 
//                                 title: "Smart Understanding",
//                                 description: "Uses multiple AI models to better understand your questions" 
//                             },
//                             { 
//                                 icon: Search, 
//                                 title: "Comprehensive Search",
//                                 description: "Searches across multiple sources for complete answers" 
//                             },
//                             { 
//                                 icon: Image, 
//                                 title: "Image Understanding",
//                                 description: "Can understand and explain images you share" 
//                             },
//                             { 
//                                 icon: Command, 
//                                 title: "Smart Calculations",
//                                 description: "Performs complex calculations and analysis in real-time" 
//                             },
//                             { 
//                                 icon: GraduationCap, 
//                                 title: "Research Assistant",
//                                 description: "Helps find and explain academic research" 
//                             },
//                             { 
//                                 icon: Sparkles, 
//                                 title: "Natural Conversations",
//                                 description: "Responds in a clear, conversational way" 
//                             }
//                         ].map((feature, i) => (
//                             <motion.div
//                                 key={i}
//                                 className="group relative p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300"
//                                 whileHover={{ y: -4 }}
//                             >
//                                 <div className="space-y-4">
//                                     <div className="p-2.5 w-fit rounded-xl bg-neutral-100 dark:bg-neutral-800">
//                                         <feature.icon className="h-6 w-6" />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <h3 className="text-xl font-semibold">{feature.title}</h3>
//                                         <p className="text-neutral-600 dark:text-neutral-400">{feature.description}</p>
//                                     </div>
//                                 </div>
//                             </motion.div>
//                         ))}
//                     </div>
//                 </motion.div>
//             </div>

//             {/* New Use Cases Section */}
//             <div className="py-24 px-4 bg-neutral-50 dark:bg-neutral-900/50 border-y border-neutral-200 dark:border-neutral-800">
//                 <motion.div className="container max-w-5xl mx-auto space-y-16">
//                     <div className="text-center space-y-4">
//                         <h2 className="text-3xl font-bold">Built For Everyone</h2>
//                         <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
//                             Whether you need quick answers or in-depth research, Scira adapts to your search needs.
//                         </p>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                         <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
//                             <h3 className="text-lg font-semibold mb-2">Students</h3>
//                             <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
//                                 <li>Research paper assistance</li>
//                                 <li>Complex topic explanations</li>
//                                 <li>Math problem solving</li>
//                             </ul>
//                         </div>
//                         <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
//                             <h3 className="text-lg font-semibold mb-2">Researchers</h3>
//                             <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
//                                 <li>Academic paper analysis</li>
//                                 <li>Data interpretation</li>
//                                 <li>Literature review</li>
//                             </ul>
//                         </div>
//                         <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
//                             <h3 className="text-lg font-semibold mb-2">Professionals</h3>
//                             <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
//                                 <li>Market research</li>
//                                 <li>Technical documentation</li>
//                                 <li>Data analysis</li>
//                             </ul>
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>

//             {/* Footer Section */}
//             <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
//                 <div className="mx-auto max-w-5xl px-4 py-12">
//                     <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
//                         <div className="flex items-center gap-3">
//                             <img src="/scira.png" alt="Scira Logo" className="h-8 w-8" />
//                             <p className="text-sm text-neutral-600 dark:text-neutral-400">
//                                 © {new Date().getFullYear()} All rights reserved.
//                             </p>
//                         </div>
                        
//                         <div className="flex items-center gap-3">
//                             <Link
//                                 href="https://x.com/sciraai"
//                                 className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                             >
//                                 <XLogo className="h-5 w-5" />
//                             </Link>
//                             <Link
//                                 href="https://git.new/scira"
//                                 className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                             >
//                                 <Github className="h-5 w-5" />
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </footer>
//         </div>
//     );
// } 