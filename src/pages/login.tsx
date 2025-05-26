import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginImage from '../assets/loginImage.png';
import { X } from "lucide-react";
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        toast.promise(
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (email && password) {
                        resolve('Login successful!');
                        navigate('/admin');
                    } else {
                        reject(new Error('Please enter email and password'));
                    }
                }, 2000); // Simulate 2-second API call
            }),
            {
                loading: 'Logging in...',
                success: () => {
                    setIsSubmitting(false);
                    return 'Login successful!';
                },
                error: (err) => {
                    setIsSubmitting(false);
                    return `Error: ${err.message}`;
                }
            }
        );
    };

    const handleTeacherLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Teacher login with:', email, password);
    };

    const handleForgotPasswordSubmit = () => {
        console.log('Password reset requested for:', forgotPasswordEmail);
        setShowForgotPasswordModal(false);
        setShowSuccessModal(true);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setShowForgotPasswordModal(false);
            setShowSuccessModal(false);
        }
    };

    return (
        <div className="grid min-h-screen w-full font-sans grid-cols-1 lg:grid-cols-[5.4fr_4.6fr]">
            {/* Left side - Login Form */}
            <div className="flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-8 bg-white">
                <div className="max-w-lg w-full">
                    <h1 className="text-textColor text-4xl font-bold mb-1 text-center sm:text-left">
                        Access to Britannica
                    </h1>
                    <h2 className="text-textColor text-4xl font-bold mb-8 text-center sm:text-left">
                        Education Sites
                    </h2>

                    <form>
                        <div className="mb-5">
                            <label
                                htmlFor="email"
                                className="block text-textColor text-base mb-2"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="p-4 py-3 w-full border border-gray-300 rounded-lg text-base bg-primary/5 placeholder:text-gray-400"
                            />
                        </div>

                        <div className="mb-3 relative">
                            <label
                                htmlFor="password"
                                className="block text-textColor text-base mb-2"
                            >
                                Password
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder="Enter Your Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="p-4 py-3 w-full border border-gray-300 rounded-lg text-base bg-primary/5 placeholder:text-gray-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-11 text-primary text-base hover:underline cursor-pointer"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>

                        <div className="text-right mb-5">
                            <button
                                type="button"
                                onClick={() => setShowForgotPasswordModal(true)}
                                className="text-secondary hover:underline cursor-pointer"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center sm:justify-start w-full">
                            <button
                                type="button"
                                onClick={handleAdminLogin}
                                className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg font-medium cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                Admin Login
                            </button>
                            <button
                                type="button"
                                onClick={handleTeacherLogin}
                                className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg font-medium cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                Teacher Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right side - Image (hidden below lg) */}
            <div
                className="hidden lg:block bg-cover bg-center"
                style={{ backgroundImage: `url(${loginImage})` }}
            />

            {/* Forgot Password Modal */}
            {showForgotPasswordModal && (
                <div
                    className="fixed inset-0 bg-black/40 bg-opacity-50 z-90 flex items-center justify-center px-4"
                    onClick={handleBackdropClick}
                >
                    <div className="bg-white rounded-lg w-full max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col sm:px-10 py-4">
                        <div className="bg-white px-8 py-6 flex justify-between items-center border-b border-gray-100 flex-shrink-0">
                            <h2 className="text-3xl font-bold text-textColor">Forgot Password</h2>
                            <button onClick={() => setShowForgotPasswordModal(false)} className="text-textColor hover:text-textColor/90 cursor-pointer">
                                <X className="h-7 w-7" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-textColor mb-2">
                                        Email address<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={forgotPasswordEmail}
                                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg text-base bg-primary/5 placeholder:text-gray-400"
                                        placeholder="Enter your registered email"
                                    />
                                </div>

                                <div className="mt-8">
                                    <button
                                        type="button"
                                        onClick={handleForgotPasswordSubmit}
                                        className="bg-primary text-white px-8 py-3 rounded-lg font-medium cursor-pointer"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div
                    className="fixed inset-0 bg-black/40 bg-opacity-50 z-90 flex items-center justify-center px-4"
                    onClick={handleBackdropClick}
                >
                    <div className="bg-white rounded-lg w-full max-w-[500px] overflow-hidden flex flex-col sm:px-10 py-8">
                        <div className="flex-1 px-8 py-6 text-center">
                            <p className="text-textColor text-lg mb-8">A password reset link sent to your registered email address. Please check your inbox to proceed</p>
                            <button
                                type="button"
                                onClick={() => setShowSuccessModal(false)}
                                className="bg-primary text-white px-8 py-3 rounded-lg font-medium cursor-pointer"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;