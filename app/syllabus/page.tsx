"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import { Plus, Trash2, Map, Sparkles, CheckCircle2, Circle, Clock, ChevronRight } from "lucide-react";

export default function SyllabusPage() {
    const [input, setInput] = useState("");
    const [topics, setTopics] = useState<{ id: number; name: string }[]>([]);
    const [roadmap, setRoadmap] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedNode, setExpandedNode] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // --- ACTIONS ---
    const addTopic = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        setTopics([...topics, { id: Date.now(), name: input }]);
        setInput("");
    };

    const removeTopic = (id: number) => {
        setTopics(topics.filter((t) => t.id !== id));
    };

    const generateRoadmap = async () => {
        if (topics.length === 0) return;
        setLoading(true);
        setRoadmap([]); // Reset
        setError(null);

        try {
            const res = await fetch("/api/roadmap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    topics: topics.map(t => t.name),
                    pace: "Normal"
                }),
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || "Failed to generate roadmap");
            }
            
            if (data.roadmap && Array.isArray(data.roadmap)) {
                setRoadmap(data.roadmap);
            } else {
                throw new Error("Invalid roadmap format received");
            }
        } catch (error: any) {
            console.error("Roadmap error:", error);
            setError(error.message || "AI is busy! Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#FDFBF7] font-sans text-stone-800">
            <Sidebar />

            <div className="pl-24 lg:pl-32 pr-8 py-10 w-full max-w-6xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-stone-900 flex items-center gap-3">
                        <Map className="text-orange-500" size={36} /> Syllabus Map
                    </h1>
                    <p className="text-stone-500 font-medium mt-2">
                        Turn your subjects into a structured adventure path.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* --- LEFT: INPUTS --- */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm">
                            <h3 className="font-bold text-lg mb-4">Add Your Subjects</h3>

                            <form onSubmit={addTopic} className="flex gap-2 mb-6">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="e.g. Thermodynamics, ReactJS..."
                                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-orange-200 font-medium"
                                />
                                <button className="bg-stone-900 text-white p-3 rounded-xl hover:bg-stone-700 transition">
                                    <Plus size={20} />
                                </button>
                            </form>

                            {/* LIST OF TOPICS */}
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {topics.length === 0 && (
                                    <p className="text-center text-stone-400 text-sm italic py-4">No subjects added yet.</p>
                                )}
                                {topics.map((t) => (
                                    <div key={t.id} className="flex justify-between items-center p-3 bg-stone-50 rounded-xl border border-stone-100 animate-in slide-in-from-left-2">
                                        <span className="font-bold text-stone-700">{t.name}</span>
                                        <button onClick={() => removeTopic(t.id)} className="text-stone-400 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* GENERATE BUTTON */}
                            <button
                                onClick={generateRoadmap}
                                disabled={loading || topics.length === 0}
                                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-orange-200/50 hover:-translate-y-1 transition disabled:opacity-50 disabled:translate-y-0 flex justify-center items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} /> Generate Roadmap
                                    </>
                                )}
                            </button>

                            {/* ERROR MESSAGE */}
                            {error && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-in slide-in-from-top">
                                    <p className="font-bold">⚠️ Error</p>
                                    <p>{error}</p>
                                </div>
                            )}
                        </div>

                        {/* STATS (Dynamic if roadmap exists) */}
                        {roadmap.length > 0 && (
                            <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 animate-in fade-in">
                                <h4 className="font-bold text-orange-800 mb-2">Estimated Time</h4>
                                <p className="text-3xl font-black text-stone-900">
                                    {roadmap.reduce((acc, curr) => acc + parseInt(curr.duration), 0)} Days
                                </p>
                                <p className="text-sm text-orange-700 mt-2">Based on normal learning pace.</p>
                            </div>
                        )}
                    </div>

                    {/* --- RIGHT: THE MAP --- */}
                    <div className="lg:col-span-2 relative">
                        {roadmap.length === 0 && !loading && (
                            <div className="h-full flex flex-col items-center justify-center text-stone-300 border-2 border-dashed border-stone-200 rounded-[3rem] p-10 min-h-[400px]">
                                <Map size={64} className="mb-4 opacity-50" />
                                <p className="font-bold">Map Area Empty</p>
                                <p className="text-sm">Add subjects to generate your path.</p>
                            </div>
                        )}

                        {/* TIMELINE RENDERER */}
                        <div className="space-y-0 relative pb-20">
                            {/* CONNECTING LINE */}
                            {roadmap.length > 0 && (
                                <div className="absolute left-[27px] top-8 bottom-0 w-1 bg-stone-200 rounded-full -z-10"></div>
                            )}

                            {roadmap.map((node, index) => (
                                <div
                                    key={index}
                                    className="relative pl-16 py-4 animate-in slide-in-from-bottom-4"
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    {/* NODE CIRCLE */}
                                    <div className={`absolute left-0 top-6 w-14 h-14 rounded-full border-4 border-[#FDFBF7] shadow-sm flex items-center justify-center z-10 cursor-pointer transition-all hover:scale-110
                    ${expandedNode === index ? "bg-stone-900 text-white" : "bg-white text-stone-400 hover:text-orange-500"}
                  `}
                                        onClick={() => setExpandedNode(expandedNode === index ? null : index)}
                                    >
                                        <span className="font-bold text-lg">{index + 1}</span>
                                    </div>

                                    {/* CONTENT CARD */}
                                    <div
                                        onClick={() => setExpandedNode(expandedNode === index ? null : index)}
                                        className={`bg-white p-6 rounded-3xl border border-stone-100 shadow-sm cursor-pointer transition-all hover:shadow-md
                    ${expandedNode === index ? "ring-2 ring-stone-900" : ""}
                  `}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-stone-900">{node.title}</h3>
                                                <p className="text-stone-500 text-sm mt-1 line-clamp-2">{node.description}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase
                          ${node.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                                        node.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'}
                        `}>
                                                    {node.difficulty}
                                                </span>
                                                <div className="flex items-center gap-1 text-xs font-bold text-stone-400">
                                                    <Clock size={12} /> {node.duration}
                                                </div>
                                            </div>
                                        </div>

                                        {/* EXPANDED DETAILS (THE "BETTER" FEATURE) */}
                                        {expandedNode === index && (
                                            <div className="mt-6 pt-6 border-t border-stone-100 animate-in fade-in">
                                                <h4 className="font-bold text-stone-800 mb-3 flex items-center gap-2">
                                                    <CheckCircle2 size={16} className="text-green-500" /> Milestones
                                                </h4>
                                                <div className="space-y-2">
                                                    {node.subtopics.map((sub: string, i: number) => (
                                                        <div key={i} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                                                            <Circle size={10} className="text-stone-300" />
                                                            <span className="text-sm font-medium text-stone-700">{sub}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button className="w-full mt-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-bold hover:bg-orange-500 transition flex items-center justify-center gap-2">
                                                    Start Topic Lesson <ChevronRight size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}