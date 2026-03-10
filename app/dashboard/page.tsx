"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { Zap, Brain, Heart, Sparkles, Shield, Users, Coffee, Swords, CheckCircle, Plus, Search, ScanFace } from "lucide-react";
import MagicSearch from "@/app/components/MagicSearch";
import Sidebar from "@/app/components/Sidebar"; // IMPORT SIDEBAR
import ArPet from "@/app/components/ArPet";
import dynamic from 'next/dynamic';

const PetCanvas = dynamic(() => import('@/app/components/PetCanvas'), {
    ssr: false, // Never run this on the server
    loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">Loading Pet...</div>
});

export default function RPGDashboard() {
    const router = useRouter();
    const [showAR, setShowAR] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState({
        username: "Player",
        guild: "Novice",
        level: 1,
        gold: 0,
        int: 0,
        vit: 0,
        wis: 0,
        currentQuest: ""
    });
    const [newQuest, setNewQuest] = useState("");
    const [loadingAction, setLoadingAction] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // --- FETCH DATA ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            try {
                if (!currentUser) {
                    // Allow guest mode - don't force login
                    setUser(null);
                    setStats({
                        username: "Guest",
                        guild: "Novice",
                        level: 1,
                        gold: 0,
                        int: 0,
                        vit: 0,
                        wis: 0,
                        currentQuest: ""
                    });
                    setIsLoading(false);
                } else {
                    setUser(currentUser);
                    try {
                        const docRef = doc(db, "users", currentUser.uid);
                        const docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            setStats(prev => ({ ...prev, ...docSnap.data() }));
                        } else {
                            // User exists but no data yet - use defaults
                            setStats(prev => ({ ...prev, username: currentUser.email?.split('@')[0] || "Player" }));
                        }
                    } catch (err) {
                        console.error("Error fetching user data:", err);
                        setError("Could not load user data. Using defaults.");
                    }
                    setIsLoading(false);
                }
            } catch (err) {
                console.error("Auth error:", err);
                setError("Authentication error. Using guest mode.");
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, [router]);

    // --- ACTIONS ---
    const handleStatBoost = async (type: string) => {
        if (loadingAction) return;
        setLoadingAction(true);

        try {
            if (user) {
                // If logged in, save to Firebase
                const userRef = doc(db, "users", user.uid);
                const updates = type === 'water'
                    ? { vit: increment(1), gold: increment(10) }
                    : { wis: increment(1), gold: increment(15) };
                await updateDoc(userRef, updates);
            }

            // Update local state (works for both logged in and guest)
            setStats(prev => ({
                ...prev,
                vit: type === 'water' ? prev.vit + 1 : prev.vit,
                wis: type === 'meditate' ? prev.wis + 1 : prev.wis,
                gold: prev.gold + (type === 'water' ? 10 : 15)
            }));

            // Show success message
            const goldEarned = type === 'water' ? 10 : 15;
            const statName = type === 'water' ? 'VIT' : 'WIS';
            setSuccessMessage(`+${goldEarned} Gold, +1 ${statName}! 🎉`);
            setTimeout(() => setSuccessMessage(null), 3000);
            
        } catch (err) {
            console.error("Error updating stats:", err);
            setError("Could not save progress. Changes are temporary.");
        } finally {
            setLoadingAction(false);
        }
    };

    const handleSetQuest = async () => {
        if (!newQuest.trim()) {
            setError("Please enter a quest!");
            setTimeout(() => setError(null), 3000);
            return;
        }
        
        try {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, { currentQuest: newQuest.trim() });
            }
            setStats(prev => ({ ...prev, currentQuest: newQuest.trim() }));
            setNewQuest("");
            setSuccessMessage("Quest set! Let's do this! 💪");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error("Error setting quest:", err);
            // Still update locally even if Firebase fails
            setStats(prev => ({ ...prev, currentQuest: newQuest.trim() }));
            setNewQuest("");
            if (!user) {
                setSuccessMessage("Quest set! Login to save permanently.");
                setTimeout(() => setSuccessMessage(null), 3000);
            } else {
                setError("Quest set locally. Could not sync to server.");
                setTimeout(() => setError(null), 3000);
            }
        }
    };

    const handleCompleteQuest = async () => {
        if (!stats.currentQuest) return;

        try {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                    currentQuest: "",
                    int: increment(10),
                    gold: increment(100),
                    level: increment(1)
                });
            }

            setStats(prev => ({
                ...prev,
                currentQuest: "",
                int: prev.int + 10,
                gold: prev.gold + 100,
                level: prev.level + 1
            }));

            setSuccessMessage("Quest Complete! +100 Gold, +10 INT, Level Up! 🎊");
            setTimeout(() => setSuccessMessage(null), 4000);
            
        } catch (err) {
            console.error("Error completing quest:", err);
            // Still update locally
            setStats(prev => ({
                ...prev,
                currentQuest: "",
                int: prev.int + 10,
                gold: prev.gold + 100,
                level: prev.level + 1
            }));
            setSuccessMessage("Quest Complete! +100 Gold, +10 INT, Level Up! 🎊");
            setTimeout(() => setSuccessMessage(null), 4000);
            
            if (!user) {
                setTimeout(() => {
                    setError("Progress not saved. Login to keep your achievements!");
                    setTimeout(() => setError(null), 3000);
                }, 4000);
            }
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-stone-600 font-bold">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-slate-800 font-sans selection:bg-orange-500 selection:text-white pb-20 pl-32">
            <ArPet isOpen={showAR} onClose={() => setShowAR(false)} />

            {/* ADD SIDEBAR HERE */}
            <Sidebar />
            <MagicSearch />

            {/* Success Banner */}
            {successMessage && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg max-w-md animate-in slide-in-from-top">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">✅</span>
                        <p className="font-bold text-sm">{successMessage}</p>
                    </div>
                </div>
            )}

            {/* Error Banner */}
            {error && (
                <div className="fixed top-4 right-4 z-50 bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded-lg shadow-lg max-w-md animate-in slide-in-from-right">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div className="flex-1">
                            <p className="font-bold text-sm">{error}</p>
                            {!user && (
                                <button 
                                    onClick={() => router.push('/login')}
                                    className="mt-2 text-xs underline hover:text-orange-900"
                                >
                                    Login to save progress
                                </button>
                            )}
                        </div>
                        <button 
                            onClick={() => setError(null)}
                            className="text-orange-500 hover:text-orange-700"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Guest Mode Banner */}
            {!user && !error && (
                <div className="fixed top-4 right-4 z-50 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg shadow-lg max-w-md">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">👋</span>
                        <div className="flex-1">
                            <p className="font-bold text-sm">Guest Mode</p>
                            <p className="text-xs mt-1">Your progress won't be saved.</p>
                            <button 
                                onClick={() => router.push('/login')}
                                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-600"
                            >
                                Login to Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="pr-8 w-full transition-all duration-300">

                {/* --- TOP HUD --- */}
                <nav className="w-full top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md h-24 flex items-center justify-between sticky">

                    <div className="flex items-center gap-4">
                        <div className="relative group cursor-pointer">
                            <div className="w-14 h-14 bg-gradient-to-tr from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20 transform group-hover:scale-105 transition-all">
                                <span className="font-black text-2xl">{stats.username[0]?.toUpperCase()}</span>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-stone-800 text-white border-2 border-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-md">
                                LVL {stats.level}
                            </div>
                        </div>
                        <div>
                            <h1 className="font-black text-2xl text-stone-800 tracking-tight">Hi, {stats.username}</h1>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-400">
                                <Shield size={12} className="text-orange-500" fill="currentColor" />
                                <span className="uppercase tracking-wider">Guild: {stats.guild}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="bg-white px-5 py-2 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1 text-amber-500 font-black text-2xl drop-shadow-sm">
                                    <span>{stats.gold}</span>
                                    <Zap size={20} fill="currentColor" />
                                </div>
                                <span className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">Gold Coins</span>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">

                    {/* --- LEFT: MAIN QUEST BOARD --- */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* ACTIVE QUEST CARD */}
                        <div className="bg-white rounded-[2.5rem] p-10 relative overflow-hidden shadow-xl shadow-orange-500/5 border border-stone-100 group">
                            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-400 to-red-500"></div>

                            <div className="flex justify-between items-start mb-8">
                                <div className="flex-1 mr-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Main Focus</span>
                                        <span className="text-stone-300 text-xs font-bold">• Daily Objective</span>
                                    </div>

                                    {stats.currentQuest ? (
                                        <h3 className="text-3xl md:text-4xl font-black text-stone-800 leading-tight">{stats.currentQuest}</h3>
                                    ) : (
                                        <div className="flex gap-3 mt-4">
                                            <input
                                                type="text"
                                                placeholder="Type your next mission..."
                                                className="bg-stone-50 border-2 border-stone-100 rounded-2xl px-5 py-4 text-base w-full focus:outline-none focus:border-orange-500 transition-colors font-bold text-stone-700 placeholder:font-medium"
                                                value={newQuest}
                                                onChange={(e) => setNewQuest(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && newQuest.trim()) {
                                                        handleSetQuest();
                                                    }
                                                }}
                                            />
                                            <button 
                                                onClick={handleSetQuest} 
                                                disabled={!newQuest.trim()}
                                                className="bg-stone-800 text-white px-6 rounded-2xl hover:bg-black font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Plus size={24} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-orange-50 p-5 rounded-3xl hidden sm:block group-hover:rotate-6 transition-transform">
                                    <Swords className="text-orange-500" size={48} />
                                </div>
                            </div>

                            {stats.currentQuest && (
                                <>
                                    <div className="flex gap-4 text-sm font-bold text-stone-500 mb-8">
                                        <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-xl border border-amber-100">
                                            <Zap size={16} fill="currentColor" /> +100 Gold
                                        </div>
                                        <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl border border-blue-100">
                                            <Brain size={16} /> +10 INT
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCompleteQuest}
                                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-500/30 transform hover:translate-y-[-2px] active:scale-[0.98] text-lg tracking-wide"
                                    >
                                        <CheckCircle size={24} strokeWidth={3} />
                                        Complete Mission
                                    </button>
                                </>
                            )}
                        </div>

                        {/* 2. THE 3D COMPANION */}
                        <div className="bg-[#F0F2F5] rounded-[2.5rem] h-[350px] relative overflow-hidden border border-white shadow-inner group">

                            {/* Background Environment */}
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-white opacity-50"></div>

                            {/* The 3D Scene */}
                            <PetCanvas level={stats.level} vit={stats.vit} />

                            {/* Status Badge */}
                            <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white/50 flex flex-col items-end">
                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Companion</span>
                                <span className={`font-black text-lg ${stats.vit < 4 ? "text-red-500" : "text-green-500"}`}>
                                    {stats.vit < 4 ? "Weak" : "Healthy"}
                                </span>
                            </div>

                            <button
                                onClick={() => setShowAR(true)}
                                className="absolute bottom-4 right-4 bg-stone-900 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform z-10"
                                title="View in AR"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold pl-2">AR Mode</span>
                                    <div className="bg-white/20 p-1.5 rounded-full">
                                        <ScanFace size={16} /> {/* Import ScanFace from lucide-react */}
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* NAV BUTTONS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* SYLLABUS LINK */}
                            <button
                                onClick={() => router.push('/syllabus')}
                                className="bg-white p-8 rounded-[2rem] border-2 border-transparent hover:border-blue-400 shadow-lg shadow-stone-200/50 transition-all text-left group"
                            >
                                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                                    <Brain size={32} />
                                </div>
                                <h4 className="font-black text-xl text-stone-800">Syllabus Map</h4>
                                <p className="text-sm text-stone-400 font-bold mt-2">Track Chapters & Topics</p>
                            </button>

                            {/* CHILL LINK */}
                            <button className="bg-white p-8 rounded-[2rem] border-2 border-transparent hover:border-purple-400 shadow-lg shadow-stone-200/50 transition-all text-left group">
                                <div className="bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                                    <Coffee size={32} />
                                </div>
                                <h4 className="font-black text-xl text-stone-800">The Tavern</h4>
                                <p className="text-sm text-stone-400 font-bold mt-2">Chill Zone (15m)</p>
                            </button>
                        </div>
                    </div>

                    {/* --- RIGHT: PLAYER STATS --- */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-stone-400 text-xs font-black uppercase tracking-widest">Attributes</h3>
                            <span className="bg-stone-100 text-stone-400 text-[10px] font-bold px-3 py-1 rounded-full">SEASON 1</span>
                        </div>

                        {/* STAT CARDS */}
                        <div className="space-y-4">
                            <div className="bg-white p-5 rounded-3xl flex items-center gap-5 shadow-sm border border-stone-100 hover:shadow-md transition-all relative overflow-hidden group">
                                <div className="absolute right-0 top-0 w-24 h-full bg-blue-50/50 -skew-x-12 transition-transform group-hover:translate-x-2"></div>
                                <div className="bg-blue-500 p-4 rounded-2xl text-white shadow-lg shadow-blue-500/20 z-10">
                                    <Brain size={24} />
                                </div>
                                <div className="z-10">
                                    <h4 className="font-black text-3xl text-stone-800">{stats.int}</h4>
                                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Intelligence</p>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-3xl flex items-center gap-5 shadow-sm border border-stone-100 hover:shadow-md transition-all relative overflow-hidden group">
                                <div className="absolute right-0 top-0 w-24 h-full bg-red-50/50 -skew-x-12 transition-transform group-hover:translate-x-2"></div>
                                <div className="bg-red-500 p-4 rounded-2xl text-white shadow-lg shadow-red-500/20 z-10">
                                    <Heart size={24} />
                                </div>
                                <div className="z-10">
                                    <h4 className="font-black text-3xl text-stone-800">{stats.vit}</h4>
                                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Vitality</p>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-3xl flex items-center gap-5 shadow-sm border border-stone-100 hover:shadow-md transition-all relative overflow-hidden group">
                                <div className="absolute right-0 top-0 w-24 h-full bg-purple-50/50 -skew-x-12 transition-transform group-hover:translate-x-2"></div>
                                <div className="bg-purple-500 p-4 rounded-2xl text-white shadow-lg shadow-purple-500/20 z-10">
                                    <Sparkles size={24} />
                                </div>
                                <div className="z-10">
                                    <h4 className="font-black text-3xl text-stone-800">{stats.wis}</h4>
                                    <p className="text-[10px] text-purple-500 font-bold uppercase tracking-widest">Wisdom</p>
                                </div>
                            </div>
                        </div>

                        {/* SOS HABITS */}
                        <div className="mt-8 pt-8 border-t border-stone-200">
                            <h3 className="text-stone-400 text-xs font-black uppercase tracking-widest px-2 mb-4">Quick Grind</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleStatBoost('water')}
                                    disabled={loadingAction}
                                    className="w-full flex items-center justify-between bg-cyan-50 p-4 rounded-2xl border border-cyan-100 hover:bg-cyan-100 transition-colors text-cyan-900 font-bold text-sm group disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                                >
                                    {loadingAction && (
                                        <div className="absolute inset-0 bg-cyan-100/50 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-600"></div>
                                        </div>
                                    )}
                                    <span className="flex items-center gap-3">
                                        <span className="bg-white p-2 rounded-xl shadow-sm">💧</span> Drink Water
                                    </span>
                                    <span className="text-cyan-600 text-[10px] font-black group-hover:scale-110 transition-transform bg-white px-2 py-1 rounded-md shadow-sm">+10 GOLD</span>
                                </button>
                                <button
                                    onClick={() => handleStatBoost('meditate')}
                                    disabled={loadingAction}
                                    className="w-full flex items-center justify-between bg-fuchsia-50 p-4 rounded-2xl border border-fuchsia-100 hover:bg-fuchsia-100 transition-colors text-fuchsia-900 font-bold text-sm group disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                                >
                                    {loadingAction && (
                                        <div className="absolute inset-0 bg-fuchsia-100/50 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-fuchsia-600"></div>
                                        </div>
                                    )}
                                    <span className="flex items-center gap-3">
                                        <span className="bg-white p-2 rounded-xl shadow-sm">🧘</span> Meditate
                                    </span>
                                    <span className="text-fuchsia-600 text-[10px] font-black group-hover:scale-110 transition-transform bg-white px-2 py-1 rounded-md shadow-sm">+15 GOLD</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}