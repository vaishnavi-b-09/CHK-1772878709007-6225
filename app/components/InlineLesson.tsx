"use client";

import React, { useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Html, Stars, Stage } from "@react-three/drei";
import ReactFlow, { Background, Controls } from "reactflow";
import 'reactflow/dist/style.css';
import { Play, Pause, Maximize2 } from "lucide-react";

// --- 3D SCENE COMPONENT ---
const AutoTourScene = ({ data, isPlaying }: any) => {
    // Auto-rotate the whole group to simulate a "Video" feel
    const groupRef = React.useRef<any>(null);
    useFrame((state, delta) => {
        if (isPlaying && groupRef.current) {
            groupRef.current.rotation.y += delta * 0.3; // Slow rotation
        }
    });

    return (
        <group ref={groupRef}>
            {data.scene.map((obj: any, idx: number) => {
                let Geometry = <boxGeometry args={obj.args} />;
                if (obj.type === 'sphere') Geometry = <sphereGeometry args={obj.args} />;
                if (obj.type === 'cylinder') Geometry = <cylinderGeometry args={obj.args} />;

                return (
                    <group key={idx} position={obj.position}>
                        <mesh>
                            {Geometry}
                            <meshStandardMaterial color={obj.color} roughness={0.3} />
                        </mesh>
                        {/* 3D LABEL */}
                        <Html position={[0, 1.5, 0]} center distanceFactor={10}>
                            <div className="bg-black/70 text-white px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap backdrop-blur-sm border border-white/20">
                                {obj.label}
                            </div>
                        </Html>
                    </group>
                )
            })}
        </group>
    );
};

export default function InlineLesson({ data }: { data: any }) {
    const [isPlaying, setIsPlaying] = useState(true);

    if (!data) return null;

    return (
        <div className="w-full mt-4 rounded-xl overflow-hidden border border-stone-200 bg-stone-900 shadow-lg relative group">

            {/* --- HEADER (Lesson Title) --- */}
            <div className="absolute top-0 left-0 w-full p-3 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-start">
                <div>
                    <span className="text-orange-400 text-xs font-bold tracking-widest uppercase">{data.strategy} LESSON</span>
                    <h3 className="text-white font-bold text-sm">{data.title}</h3>
                </div>
                <button className="text-white/70 hover:text-white"><Maximize2 size={16} /></button>
            </div>

            {/* --- CONTENT ENGINE --- */}
            <div className="h-64 w-full relative">

                {/* STRATEGY: 3D */}
                {data.strategy === '3D' && (
                    <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
                        <ambientLight intensity={0.7} />
                        <pointLight position={[10, 10, 10]} />
                        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

                        <AutoTourScene data={data.data} isPlaying={isPlaying} />

                        <OrbitControls enableZoom={false} autoRotate={false} />
                    </Canvas>
                )}

                {/* STRATEGY: FLOWCHART */}
                {data.strategy === 'FLOW' && (
                    <ReactFlow
                        nodes={data.data.nodes}
                        edges={data.data.edges}
                        fitView
                        attributionPosition="bottom-right"
                    >
                        <Background color="#222" gap={20} />
                    </ReactFlow>
                )}

                {/* STRATEGY: CODE */}
                {data.strategy === 'CODE' && (
                    <div className="w-full h-full bg-[#1e1e1e] p-4 overflow-auto font-mono text-xs text-green-400">
                        <pre>{data.data.code}</pre>
                    </div>
                )}
            </div>

            {/* --- PLAYBACK CONTROLS (Video Feel) --- */}
            {data.strategy === '3D' && (
                <div className="absolute bottom-3 left-3 z-10">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-xs hover:bg-white/20 transition"
                    >
                        {isPlaying ? <Pause size={12} fill="white" /> : <Play size={12} fill="white" />}
                        {isPlaying ? "Pause Tour" : "Resume Tour"}
                    </button>
                </div>
            )}
        </div>
    );
}