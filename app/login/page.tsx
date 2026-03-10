"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        // Simple validation
        if (!formData.email || !formData.password) {
            alert("Please fill in all fields");
            setLoading(false);
            return;
        }

        // Simulate login process
        setTimeout(() => {
            router.push('/dashboard');
        }, 1000);
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 font-sans p-4">
            {/* Bear Placeholder */}
            <div className="w-full max-w-md h-48 flex items-center justify-center mb-6">
                <div className="w-24 h-24 bg-orange-400 rounded-full flex items-center justify-center text-4xl shadow-lg">
                    🐻
                </div>
            </div>

            {/* Card Container */}
            <div className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-orange-100 p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Resume your progress
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Email Input */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <Mail size={20} />
                        </div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-400 focus:bg-white rounded-2xl outline-none transition-all text-gray-800 font-semibold placeholder:text-gray-400"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <Lock size={20} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-400 focus:bg-white rounded-2xl outline-none transition-all text-gray-800 font-semibold placeholder:text-gray-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Processing..." : "Login"}
                        {!loading && <ArrowRight size={22} />}
                    </button>
                </form>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-gray-400 text-sm">
                        Don't have an account?{' '}
                        <button className="font-bold text-orange-500 hover:text-orange-600 hover:underline transition-colors">
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}