import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AuthForm from '../components/AuthForm';

const Auth = () => {
    const [isSignIn, setIsSignIn] = useState(true);

    const variants = {
        hidden: { opacity: 0, x: isSignIn ? 100 : -100 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: isSignIn ? -100 : 100 },
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => setIsSignIn(true)}
                        className={`px-4 py-2 text-lg font-semibold rounded-l-lg transition-colors ${isSignIn ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setIsSignIn(false)}
                        className={`px-4 py-2 text-lg font-semibold rounded-r-lg transition-colors ${!isSignIn ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Sign Up
                    </button>
                </div>
                <div className="overflow-hidden relative h-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isSignIn ? 'signin' : 'signup'}
                            variants={variants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                        >
                            <AuthForm isSignIn={isSignIn} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Auth;