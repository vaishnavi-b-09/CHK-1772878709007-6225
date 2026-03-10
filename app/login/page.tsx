"use client";

import React, { useState, useEffect } from "react";
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ArrowRight, User, Target, Phone, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function LoginPage() {
    const router = useRouter();

    // --- FORM STATE ---
    const [isSignUp, setIsSignUp] = useState(false);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        phone: "",
        username: "",
        aim: ""
    });

    // --- RIVE SETUP ---
    const STATE_MACHINE_NAME = "Login Machine";
    const { rive, RiveComponent } = useRive({
        src: "/bear.riv",
        stateMachines: STATE_MACHINE_NAME,
        autoplay: true,
        layout: new Layout({
            fit: Fit.Contain, // Ensures he isn't stretched
            alignment: Alignment.BottomCenter // Aligns him to the bottom of his container
        }),
    });

    const isChecking = useStateMachineInput(rive, STATE_MACHINE_NAME, "isChecking");
    const numLook = useStateMachineInput(rive, STATE_MACHINE_NAME, "numLook");
    const isHandsUp = useStateMachineInput(rive, STATE_MACHINE_NAME, "isHandsUp");
    const trigSuccess = useStateMachineInput(rive, STATE_MACHINE_NAME, "trigSuccess");
    const trigFail = useStateMachineInput(rive, STATE_MACHINE_NAME, "trigFail");

    // --- ANIMATION LOGIC ---
    useEffect(() => {
        if (numLook && !formData.password) {
            const activeText = formData.email || formData.username || formData.aim;
            numLook.value = Math.min(activeText.length * 2, 100);
        }
    }, [formData, numLook]);

    const handleTextFocus = () => { if (isChecking) isChecking.value = true; if (isHandsUp) isHandsUp.value = false; };
    const handlePasswordFocus = () => { if (isHandsUp) isHandsUp.value = true; if (isChecking) isChecking.value = false; };
    const handleBlur = () => { if (isChecking) isChecking.value = false; if (isHandsUp) isHandsUp.value = false; };

    // --- AUTH ACTIONS ---
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            handleBlur();
            if (trigSuccess) trigSuccess.fire();
            setTimeout(() => router.push('/dashboard'), 1500);
        } catch (error) {
            handleBlur();
            if (trigFail) trigFail.fire();
            alert("Login Failed. Check credentials.");
            setLoading(false);
        }
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1 && (!formData.email || !formData.password)) return alert("Please fill in fields");
        if (step === 2 && !formData.phone) return alert("Phone is required");
        setStep(step + 1);
    };

    const handleFinalRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: formData.email,
                phone: formData.phone,
                username: formData.username,
                aim: formData.aim,
                level: 1,
                gold: 100,
                guild: "Novice",
                int: 5,
                vit: 5,
                wis: 5,
                currentQuest: "Upload your first Syllabus",
                createdAt: new Date()
            });

            handleBlur();
            if (trigSuccess) trigSuccess.fire();
            setTimeout(() => router.push('/dashboard'), 1500);

        } catch (error: any) {
            handleBlur();
            if (trigFail) trigFail.fire();
            alert("Error: " + error.message);
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            if (trigSuccess) trigSuccess.fire();
            router.push('/dashboard');
        } catch (error) { console.error(error); }
    };

    // --- ANIMATION VARIANTS ---
    const slideVariants = {
        hidden: { x: 20, opacity: 0 },
        visible: { x: 0, opacity: 1 },
        exit: { x: -20, opacity: 0 }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FDFBF7] font-sans p-4 relative overflow-hidden">

            {/* WARM BACKGROUND DECORATION */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-200/30 rounded-full mix-blend-multiply filter blur-[80px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-yellow-200/30 rounded-full mix-blend-multiply filter blur-[80px]"></div>

            {/* --- BEAR CONTAINER (Fixed Height, Centered) --- */}
            <div className="w-full max-w-md h-[280px] z-10 flex items-end justify-center">
                {/* Using fit: Contain and Alignment.BottomCenter in the hook above 
                     ensures he sits at the bottom of this box 
                 */}
                <RiveComponent className="w-full h-full" />
            </div>

            {/* --- CARD CONTAINER (Negative Margin to Pull Up) --- */}
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-stone-100 p-8 pt-10 relative z-20 -mt-4">

                {/* HEADER */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-stone-800 tracking-tight">
                        {isSignUp ? "Join the Squad" : "Welcome Back"}
                    </h1>
                    <p className="text-stone-500 text-sm mt-2 font-medium">
                        {isSignUp ? "Create your character" : "Resume your progress"}
                    </p>
                </div>

                {/* FORM */}
                <form className="space-y-4">
                    <AnimatePresence mode="wait">

                        {/* STEP 1 */}
                        {(!isSignUp || step === 1) && (
                            <motion.div key="step1" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-orange-500 transition-colors"><Mail size={20} /></div>
                                    <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} onFocus={handleTextFocus} onBlur={handleBlur}
                                        className="w-full pl-12 pr-4 py-4 bg-stone-50 border-2 border-transparent focus:border-orange-400 focus:bg-white rounded-2xl outline-none transition-all text-stone-800 font-bold placeholder:text-stone-400 placeholder:font-normal" />
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-orange-500 transition-colors"><Lock size={20} /></div>
                                    <input type={showPassword ? "text" : "password"} placeholder="Password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} onFocus={handlePasswordFocus} onBlur={handleBlur}
                                        className="w-full pl-12 pr-12 py-4 bg-stone-50 border-2 border-transparent focus:border-orange-400 focus:bg-white rounded-2xl outline-none transition-all text-stone-800 font-bold placeholder:text-stone-400 placeholder:font-normal" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"> {showPassword ? <EyeOff size={20} /> : <Eye size={20} />} </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2 */}
                        {isSignUp && step === 2 && (
                            <motion.div key="step2" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-orange-500 transition-colors"><Phone size={20} /></div>
                                    <input type="tel" placeholder="Mobile Number" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} onFocus={handleTextFocus} onBlur={handleBlur}
                                        className="w-full pl-12 pr-4 py-4 bg-stone-50 border-2 border-transparent focus:border-orange-400 focus:bg-white rounded-2xl outline-none transition-all text-stone-800 font-bold placeholder:text-stone-400 placeholder:font-normal" />
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3 */}
                        {isSignUp && step === 3 && (
                            <motion.div key="step3" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-orange-500 transition-colors"><User size={20} /></div>
                                    <input type="text" placeholder="Full Name" required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} onFocus={handleTextFocus} onBlur={handleBlur}
                                        className="w-full pl-12 pr-4 py-4 bg-stone-50 border-2 border-transparent focus:border-orange-400 focus:bg-white rounded-2xl outline-none transition-all text-stone-800 font-bold placeholder:text-stone-400 placeholder:font-normal" />
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-orange-500 transition-colors"><Target size={20} /></div>
                                    <input type="text" placeholder="Your Main Goal" required value={formData.aim} onChange={e => setFormData({ ...formData, aim: e.target.value })} onFocus={handleTextFocus} onBlur={handleBlur}
                                        className="w-full pl-12 pr-4 py-4 bg-stone-50 border-2 border-transparent focus:border-orange-400 focus:bg-white rounded-2xl outline-none transition-all text-stone-800 font-bold placeholder:text-stone-400 placeholder:font-normal" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-3 pt-4">
                        {isSignUp && step > 1 && (
                            <button type="button" onClick={() => setStep(step - 1)} className="px-5 py-3 bg-stone-100 rounded-2xl text-stone-600 hover:bg-stone-200 transition-colors">
                                <ChevronLeft size={24} />
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={isSignUp ? (step === 3 ? handleFinalRegister : handleNextStep) : handleLogin}
                            disabled={loading}
                            className="flex-1 bg-[#FF6B6B] hover:bg-[#FF8E53] text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-500/20 transform hover:translate-y-[-2px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg tracking-wide"
                        >
                            {loading ? "Processing..." : isSignUp ? (step === 3 ? "Complete" : "Next") : "Login"}
                            {!loading && <ArrowRight size={22} strokeWidth={3} />}
                        </button>
                    </div>
                </form>

                {/* FOOTER */}
                <div className="w-full text-center mt-8">
                    <p className="text-stone-400 text-sm font-medium">
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}
                        <button onClick={() => { setIsSignUp(!isSignUp); setStep(1); }} className="ml-2 font-black text-[#FF6B6B] hover:text-[#FF8E53] hover:underline transition-colors">
                            {isSignUp ? "Login" : "Sign Up"}
                        </button>
                    </p>
                </div>

                {!isSignUp && (
                    <div className="w-full mt-6 border-t border-stone-100 pt-6">
                        <button onClick={handleGoogleLogin} className="w-full bg-white border-2 border-stone-100 text-stone-600 font-bold py-3.5 rounded-2xl hover:bg-stone-50 hover:border-stone-200 transition-all flex items-center justify-center gap-3">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                            <span>Continue with Google</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}