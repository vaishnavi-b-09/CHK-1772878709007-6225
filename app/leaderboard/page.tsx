"use client";
import React from "react";
import Sidebar from "@/app/components/Sidebar";
import { Trophy } from "lucide-react";

export default function Leaderboard() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] p-8 pl-32">
            <Sidebar />
            <h1 className="text-4xl font-black mb-6">🏆 Leaderboard</h1>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-gray-500">Rankings coming soon...</p>
            </div>
        </div>
    );
}