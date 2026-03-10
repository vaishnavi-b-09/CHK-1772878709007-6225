"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
    User, Mail, GraduationCap, Award, MapPin, Calendar,
    Edit3, Save, X, Camera, Sparkles, Heart, Zap
} from "lucide-react";

// --- ANIMATED MASCOT COMPONENT ---
// A cute floating robot using CSS animations
const FloatingMascot = () => (
    <div className="absolute -right-10 -top-10 w-48 h-48 animate-bounce-slow hidden md:block opacity-90">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" fill="#FFEDD5" />
            <rect x="60" y="60" width="80" height="60" rx="20" fill="#F97316" />
            <circle cx="85" cy="85" r="8" fill="white" />
            <circle cx="115" cy="85" r="8" fill="white" />
            <path d="M 80 100 Q 100 115 120 100" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" />
            <rect x="95" y="40" width="10" height="20" fill="#333" />
            <circle cx="100" cy="35" r="8" fill="#F59E0B" />
        </svg>
    </div>
);

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        education: "",
        skills: "",
        hobbies: "",
        location: "New Delhi, India"
    });

    // --- 1. FETCH DATA ---
    useEffect(() => {
        const fetchUser = async () => {
            if (!auth.currentUser) return;
            try {
                const docRef = doc(db, "users", auth.currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUser(data);
                    // Pre-fill form
                    setFormData({
                        name: data.name || "",
                        bio: data.bio || "",
                        education: data.education || "",
                        skills: data.skills?.join(", ") || "",
                        hobbies: data.hobbies?.join(", ") || "",
                        location: data.location || "New Delhi, India"
                    });
                } else {
                    // Default for new users
                    const defaultData = {
                        name: auth.currentUser.displayName || "Student",
                        email: auth.currentUser.email,
                        role: "Learner",
                        level: "Level 1",
                        joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    };
                    setUser(defaultData);
                    setFormData((prev) => ({ ...prev, name: defaultData.name }));
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };

        // Auth Listener
        const unsubscribe = auth.onAuthStateChanged((u) => {
            if (u) fetchUser();
        });
        return () => unsubscribe();
    }, []);

    // --- 2. SAVE UPDATES ---
    const handleSave = async () => {
        if (!auth.currentUser) return;
        try {
            const docRef = doc(db, "users", auth.currentUser.uid);

            // Convert comma strings to arrays
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
            const hobbiesArray = formData.hobbies.split(',').map(s => s.trim()).filter(s => s);

            const updatedData = {
                ...user,
                name: formData.name,
                bio: formData.bio,
                education: formData.education,
                location: formData.location,
                skills: skillsArray,
                hobbies: hobbiesArray
            };

            await updateDoc(docRef, updatedData);
            setUser(updatedData);
            setIsEditing(false);
        } catch (e) {
            console.error("Error saving profile:", e);
            alert("Could not save profile. Check console.");
        }
    };

    return (
        <div className="flex min-h-screen bg-[#FDFBF7] font-sans text-stone-800">
            <Sidebar />

            <div className="pl-24 lg:pl-32 pr-8 py-10 w-full max-w-7xl mx-auto animate-in fade-in duration-500">

                {/* --- HEADER BANNER --- */}
                <div className="relative mb-24 group">
                    <div className="h-64 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <FloatingMascot />
                    </div>

                    {/* AVATAR & NAME BLOCK */}
                    <div className="absolute -bottom-16 left-8 md:left-14 flex items-end gap-6 w-full">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-36 h-36 bg-white rounded-[2rem] p-2 shadow-2xl rotate-3 transition-transform group-hover:rotate-0">
                                <div className="w-full h-full bg-stone-100 rounded-[1.5rem] flex items-center justify-center text-6xl font-black text-stone-300 overflow-hidden">
                                    {user?.name?.[0] || "U"}
                                </div>
                            </div>
                            {isEditing && (
                                <button className="absolute bottom-2 right-2 bg-stone-900 text-white p-2 rounded-full hover:bg-stone-700 shadow-lg">
                                    <Camera size={16} />
                                </button>
                            )}
                        </div>

                        {/* Name & Role */}
                        <div className="mb-4 flex-1 flex justify-between items-end pr-8 md:pr-14">
                            <div>
                                {isEditing ? (
                                    <input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="text-4xl font-black text-stone-900 bg-transparent border-b-2 border-orange-300 focus:outline-none focus:border-orange-500 w-full md:w-96 placeholder:text-stone-300"
                                        placeholder="Your Name"
                                    />
                                ) : (
                                    <h1 className="text-4xl font-black text-stone-900 tracking-tight">{user?.name || "Student"}</h1>
                                )}
                                <p className="text-stone-500 font-bold text-lg flex items-center gap-2 mt-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    {user?.role || "Explorer"}
                                </p>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="hidden md:block">
                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-stone-200 text-stone-600 rounded-2xl font-bold hover:bg-stone-50 transition">
                                            <X size={18} /> Cancel
                                        </button>
                                        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                                            <Save size={18} /> Save Changes
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-2xl font-bold shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border border-stone-100">
                                        <Edit3 size={18} /> Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MAIN CONTENT GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: ABOUT & DETAILS */}
                    <div className="space-y-6">

                        {/* BIO CARD */}
                        <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                                <User size={100} />
                            </div>
                            <h3 className="font-bold text-stone-900 text-xl mb-4 flex items-center gap-2">
                                <Sparkles size={20} className="text-orange-500" /> About Me
                            </h3>

                            {isEditing ? (
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full h-32 p-4 bg-stone-50 rounded-xl border-2 border-stone-100 focus:border-orange-300 focus:outline-none font-medium text-stone-700 resize-none"
                                    placeholder="Tell us a bit about yourself..."
                                />
                            ) : (
                                <p className="text-stone-500 leading-relaxed font-medium">
                                    {user?.bio || "No bio added yet. Click edit to tell your story!"}
                                </p>
                            )}

                            {/* CONTACT DETAILS */}
                            <div className="mt-8 space-y-4">
                                <DetailRow icon={Mail} label="Email" value={user?.email} />

                                {isEditing ? (
                                    <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-stone-400 shrink-0">
                                            <MapPin size={18} />
                                        </div>
                                        <input
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="bg-transparent font-bold text-stone-700 focus:outline-none w-full"
                                            placeholder="City, Country"
                                        />
                                    </div>
                                ) : (
                                    <DetailRow icon={MapPin} label="Location" value={user?.location || "India"} />
                                )}

                                <DetailRow icon={Calendar} label="Joined" value={user?.joined || "Jan 2026"} />
                            </div>
                        </div>

                        {/* HOBBIES CARD */}
                        <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm">
                            <h3 className="font-bold text-stone-900 text-xl mb-4 flex items-center gap-2">
                                <Heart size={20} className="text-red-500" /> Interests & Hobbies
                            </h3>
                            {isEditing ? (
                                <div>
                                    <p className="text-xs text-stone-400 font-bold uppercase mb-2">Separate with commas</p>
                                    <input
                                        value={formData.hobbies}
                                        onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
                                        className="w-full p-4 bg-stone-50 rounded-xl border-2 border-stone-100 focus:border-orange-300 focus:outline-none font-bold text-stone-700"
                                        placeholder="Gaming, Coding, Music..."
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {user?.hobbies?.length > 0 ? (
                                        user.hobbies.map((hobby: string, i: number) => (
                                            <span key={i} className="px-4 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">
                                                {hobby}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-stone-400 italic text-sm">No hobbies listed.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: STATS & SKILLS */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* STATS GRID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* LEVEL CARD */}
                            <div className="bg-stone-900 p-6 rounded-[2rem] shadow-lg text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-10"><Award size={80} /></div>
                                <div className="relative z-10">
                                    <p className="text-stone-400 font-bold uppercase text-xs tracking-widest mb-1">Current Level</p>
                                    <p className="text-3xl font-black">{user?.level || "Level 1"}</p>
                                    <div className="w-full bg-stone-700 h-2 rounded-full mt-4 overflow-hidden">
                                        <div className="bg-gradient-to-r from-orange-400 to-red-500 w-1/3 h-full rounded-full" />
                                    </div>
                                    <p className="text-xs text-stone-400 mt-2">350 XP to Level 2</p>
                                </div>
                            </div>

                            {/* EDUCATION CARD */}
                            <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><GraduationCap size={20} /></div>
                                    <p className="text-xs font-bold text-stone-400 uppercase">Education</p>
                                </div>
                                {isEditing ? (
                                    <input
                                        value={formData.education}
                                        onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                        className="text-2xl font-black text-stone-900 bg-stone-50 rounded-lg px-2 py-1 -ml-2 focus:outline-none focus:ring-2 ring-orange-200"
                                    />
                                ) : (
                                    <p className="text-2xl font-black text-stone-900">{user?.education || "Student"}</p>
                                )}
                            </div>
                        </div>

                        {/* SKILLS SECTION */}
                        <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm min-h-[250px]">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="font-bold text-stone-900 text-xl flex items-center gap-2">
                                        <Zap size={20} className="text-yellow-500 fill-yellow-500" /> Skills & Tech
                                    </h3>
                                    <p className="text-stone-400 text-sm mt-1">Technologies you are learning</p>
                                </div>
                            </div>

                            {isEditing ? (
                                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                                    <label className="text-xs font-bold text-stone-400 uppercase mb-2 block">Add Skills (comma separated)</label>
                                    <textarea
                                        value={formData.skills}
                                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                        className="w-full bg-transparent font-bold text-stone-800 focus:outline-none resize-none"
                                        placeholder="React, Python, Design..."
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-3">
                                    {user?.skills?.length > 0 ? (
                                        user.skills.map((skill: string, i: number) => (
                                            <span key={i} className="px-5 py-3 bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold rounded-2xl border border-stone-200 transition transform hover:-translate-y-1 cursor-default">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <div className="w-full py-10 text-center border-2 border-dashed border-stone-200 rounded-2xl">
                                            <p className="text-stone-400 font-bold">No skills added yet.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

// --- HELPER COMPONENT ---
function DetailRow({ icon: Icon, label, value }: any) {
    return (
        <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-stone-400 shrink-0 shadow-sm">
                <Icon size={18} />
            </div>
            <div className="overflow-hidden">
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{label}</p>
                <p className="font-bold text-stone-700 truncate">{value || "Not set"}</p>
            </div>
        </div>
    );
}