"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import dynamic from "next/dynamic";
import { Box, Pencil } from "lucide-react";

// 2. LAZY LOAD THE HEAVY 3D/2D ENGINES
// This stops them from slowing down the Login Page compilation
const FabricBoard = dynamic(() => import("@/app/components/FabricBoard"), {
    ssr: false,
    loading: () => <div className="text-stone-400 p-10">Loading 2D Engine...</div>
});

const ThreeDBoard = dynamic(() => import("@/app/components/ThreeDBoard"), {
    ssr: false,
    loading: () => <div className="text-stone-400 p-10">Loading 3D Engine...</div>
});

export default function VisualizerPage() {
    const [mode, setMode] = useState<'2d' | '3d'>('2d');

    return (
        <div className="flex min-h-screen bg-stone-950 font-sans text-stone-800">
            <Sidebar />

            {/* MODE SWITCHER */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-900/90 backdrop-blur-md p-1 rounded-full border border-stone-700 flex gap-1 shadow-2xl transition-all hover:scale-105">
                <button
                    onClick={() => setMode('2d')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all duration-300 ${mode === '2d' ? 'bg-white text-black shadow-lg' : 'text-stone-400 hover:text-white'}`}
                >
                    <Pencil size={16} /> 2D Sketch
                </button>
                <button
                    onClick={() => setMode('3d')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all duration-300 ${mode === '3d' ? 'bg-indigo-600 text-white shadow-lg' : 'text-stone-400 hover:text-white'}`}
                >
                    <Box size={16} /> 3D Space
                </button>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="pl-28 w-full relative h-screen overflow-hidden bg-white">
                {/* CONDITIONAL RENDERING: Only mounts ONE engine at a time */}
                {mode === '2d' && <FabricBoard />}
                {mode === '3d' && <ThreeDBoard />}
            </div>
        </div>
    );
}