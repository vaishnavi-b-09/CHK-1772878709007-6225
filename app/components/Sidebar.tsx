"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Home,
    BookOpen,
    Box,
    LogOut,
    User
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    // --- LOGOUT ---
    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        } catch (e) { console.error(e); }
    };

    const navItems = [
        { name: "Dashboard", icon: Home, path: "/dashboard" },
        { name: "AI Tutor", icon: BookOpen, path: "/learn" },
        { name: "Visualizer", icon: Box, path: "/visualizer" },
    ];

    return (
        // Z-INDEX UPDATE: Changed z-40 to z-50 to sit ON TOP of dashboard headers
        <div className="fixed left-0 top-0 h-screen w-20 hover:w-72 bg-[#FDFBF7] border-r border-[#EBE5DA] flex flex-col py-8 z-50 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] group overflow-hidden shadow-sm hover:shadow-2xl">

            {/* LOGO */}
            <div className="px-5 mb-12 flex items-center whitespace-nowrap overflow-hidden">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20 text-white font-black text-xl">
                    G
                </div>
                <span className="ml-4 font-bold text-stone-800 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 transform translate-x-4 group-hover:translate-x-0">
                    Gyan Setu
                </span>
            </div>

            {/* NAVIGATION */}
            <nav className="flex-1 w-full px-3 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center p-3 rounded-xl transition-all duration-300 whitespace-nowrap overflow-hidden relative
                ${isActive
                                    ? "bg-white shadow-md text-orange-600"
                                    : "text-stone-500 hover:bg-[#F3EFE7] hover:text-stone-900"}
              `}
                        >
                            <item.icon size={22} className={`shrink-0 ${isActive ? "text-orange-500" : "text-stone-400 group-hover:text-stone-600"}`} />

                            <span className={`ml-4 font-semibold text-sm transition-all duration-300 delay-75 
                ${isActive ? "text-stone-900" : ""}
                opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0`
                            }>
                                {item.name}
                            </span>

                            {isActive && (
                                <div className="absolute right-3 w-2 h-2 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* BOTTOM SECTION */}
            <div className="w-full px-3 space-y-2 mt-auto border-t border-[#EBE5DA] pt-6">

                {/* PROFILE BUTTON - NOW LINKS TO PAGE */}
                <Link
                    href="/profile"
                    className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 whitespace-nowrap overflow-hidden
            ${pathname === '/profile' ? "bg-white shadow-md text-stone-900" : "text-stone-500 hover:bg-white hover:text-stone-900"}
          `}
                >
                    <User size={22} className="shrink-0" />
                    <span className="ml-4 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 translate-x-4 group-hover:translate-x-0">
                        My Profile
                    </span>
                </Link>

                {/* LOGOUT */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center p-3 rounded-xl hover:bg-red-50 text-stone-400 hover:text-red-500 transition-all duration-300 whitespace-nowrap overflow-hidden"
                >
                    <LogOut size={22} className="shrink-0" />
                    <span className="ml-4 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 translate-x-4 group-hover:translate-x-0">
                        Log Out
                    </span>
                </button>
            </div>
        </div>
    );
}