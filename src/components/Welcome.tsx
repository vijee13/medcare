import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Welcome({ onRoleSelect }: { onRoleSelect: () => void }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleRoleSelect = async (role: 'patient' | 'caretaker') => {
        if (!user) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role })
                .eq('id', user.id);

            if (error) throw error;

            // Force reload profile or callback
            onRoleSelect();
        } catch (error) {
            console.error('Error updating role:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-white p-4 rounded-xl shadow-sm inline-block mb-6">
                        <div className="bg-gradient-to-tr from-blue-500 to-teal-400 p-3 rounded-lg text-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome to MediCare Companion
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Your trusted partner in medication management. Choose your role to get
                        started with personalized features.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 mt-12 px-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRoleSelect('patient')}
                        disabled={loading}
                        className="bg-white p-8 rounded-2xl shadow-lg border-2 border-transparent hover:border-blue-500 transition-all text-left group"
                    >
                        <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                            <User className="h-8 w-8 text-blue-600 group-hover:text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-blue-600 mb-2">I'm a Patient</h2>
                        <p className="text-gray-600 mb-6">
                            Track your medication schedule and maintain your health records.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-500 mb-8">
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                                Mark medications as taken
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                                View your medication calendar
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                                Large, easy-to-use interface
                            </li>
                        </ul>
                        <div className="w-full py-3 bg-blue-600 text-white rounded-lg text-center font-medium group-hover:bg-blue-700">
                            Continue as Patient
                        </div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRoleSelect('caretaker')}
                        disabled={loading}
                        className="bg-white p-8 rounded-2xl shadow-lg border-2 border-transparent hover:border-green-500 transition-all text-left group"
                    >
                        <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                            <Users className="h-8 w-8 text-green-600 group-hover:text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-green-600 mb-2">I'm a Caretaker</h2>
                        <p className="text-gray-600 mb-6">
                            Monitor and support your loved one's medication adherence.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-500 mb-8">
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                Monitor medication compliance
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                Set up notification preferences
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                Receive email alerts
                            </li>
                        </ul>
                        <div className="w-full py-3 bg-green-600 text-white rounded-lg text-center font-medium group-hover:bg-green-700">
                            Continue as Caretaker
                        </div>
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
