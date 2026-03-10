"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail, ArrowRight, User, Target, Phone, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate login
        setTimeout(() => {
            router.push('/dashboard');
        }, 1000);
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '16px'
        }}>
            {/* Bear Placeholder */}
            <div style={{
                width: '100%',
                maxWidth: '400px',
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
            }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    background: '#fb923c',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px'
                }}>
                    🐻
                </div>
            </div>

            {/* Card Container */}
            <div style={{
                background: 'white',
                width: '100%',
                maxWidth: '400px',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid #fed7aa',
                padding: '32px'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        margin: '0 0 8px 0'
                    }}>
                        {isSignUp ? "Join the Squad" : "Welcome Back"}
                    </h1>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '14px',
                        margin: 0
                    }}>
                        {isSignUp ? "Create your character" : "Resume your progress"}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Email Input */}
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#9ca3af'
                        }}>
                            <Mail size={20} />
                        </div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            style={{
                                width: '100%',
                                paddingLeft: '48px',
                                paddingRight: '16px',
                                paddingTop: '16px',
                                paddingBottom: '16px',
                                background: '#f9fafb',
                                border: '2px solid transparent',
                                borderRadius: '16px',
                                outline: 'none',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#1f2937',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#fb923c'}
                            onBlur={(e) => e.target.style.borderColor = 'transparent'}
                        />
                    </div>

                    {/* Password Input */}
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#9ca3af'
                        }}>
                            <Lock size={20} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            style={{
                                width: '100%',
                                paddingLeft: '48px',
                                paddingRight: '48px',
                                paddingTop: '16px',
                                paddingBottom: '16px',
                                background: '#f9fafb',
                                border: '2px solid transparent',
                                borderRadius: '16px',
                                outline: 'none',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#1f2937',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#fb923c'}
                            onBlur={(e) => e.target.style.borderColor = 'transparent'}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: '#9ca3af',
                                cursor: 'pointer'
                            }}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            background: '#ea580c',
                            color: 'white',
                            fontWeight: 'bold',
                            padding: '16px',
                            borderRadius: '16px',
                            border: 'none',
                            fontSize: '18px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            opacity: loading ? 0.7 : 1,
                            transform: loading ? 'none' : 'scale(1)',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => !loading && (e.target.style.background = '#dc2626')}
                        onMouseOut={(e) => !loading && (e.target.style.background = '#ea580c')}
                    >
                        {loading ? "Processing..." : "Login"}
                        {!loading && <ArrowRight size={22} />}
                    </button>
                </form>

                {/* Footer */}
                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
                        Don't have an account?{' '}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#ea580c',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}