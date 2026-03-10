"use client";

import React from 'react';
import dynamic from 'next/dynamic'; // Import dynamic
import { X, Box, GitMerge, Code2 } from "lucide-react";
import ReactFlow, { Background, Controls } from "reactflow";
import 'reactflow/dist/style.css';

// 1. LAZY LOAD THE 3D BOARD
// This splits that huge purple block into a separate file that only loads later.
const ThreeDBoard = dynamic(() => import("./ThreeDBoard"), {
    ssr: false,
    loading: () => <div className="h-64 flex items-center justify-center text-stone-400">Loading 3D Engine...</div>
});

interface LearningOverlayProps {
    data: any;
    onClose: () => void;
}

export default function LearningOverlay({ data, onClose }: LearningOverlayProps) {
    if (!data) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-stone-100">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <div className="p-2 bg-indigo-600 text-white rounded-lg">
                            {data.strategy === '3D' && <Box size={20} />}
                            {data.strategy === 'FLOW' && <GitMerge size={20} />}
                            {data.strategy === 'CODE' && <Code2 size={20} />}
                        </div>
                        {data.title || "Visual Lesson"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full"><X size={20} /></button>
                </div>

                {/* Content */}
                <div className="flex-1 relative bg-stone-50 overflow-hidden">
                    {data.strategy === '3D' && (
                        /* Now passing initialScene is valid because we fixed Step 1 */
                        <ThreeDBoard initialScene={data.data.scene} />
                    )}

                    {/* STRATEGY B: FLOWCHART (React Flow) */}
                    {data.strategy === 'FLOW' && (
                        <div className="w-full h-full">
                            <ReactFlow
                                defaultNodes={data.data.nodes}
                                defaultEdges={data.data.edges}
                                fitView
                            >
                                <Background color="#ccc" gap={20} />
                                <Controls />
                            </ReactFlow>
                        </div>
                    )}

                    {/* STRATEGY C: CODE / MATH */}
                    {data.strategy === 'CODE' && (
                        <div className="w-full h-full flex items-center justify-center p-10">
                            <div className="bg-stone-900 text-green-400 p-8 rounded-2xl shadow-2xl font-mono text-lg w-full max-w-4xl overflow-auto border border-stone-700">
                                <pre>{data.data.code}</pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}