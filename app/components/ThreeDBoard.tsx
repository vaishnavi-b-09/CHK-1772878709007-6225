"use client";

import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, TransformControls, Grid, Stage, Environment } from "@react-three/drei";
import { Mic, Send, Trash2, MousePointer2, Move, RotateCw, Sparkles, Loader2 } from "lucide-react";
import * as THREE from "three";

// --- DYNAMIC SHAPE COMPONENT ---
// This renders a single object from our JSON list
const SceneObject = ({ data, isSelected, onSelect }: any) => {
    const mesh = useRef<THREE.Mesh>(null);

    // Geometry Map
    let Geometry = <boxGeometry args={data.args || [1, 1, 1]} />;
    if (data.type === 'sphere') Geometry = <sphereGeometry args={data.args || [1, 32, 32]} />;
    if (data.type === 'cylinder') Geometry = <cylinderGeometry args={data.args || [1, 1, 2, 32]} />;
    if (data.type === 'cone') Geometry = <coneGeometry args={data.args || [1, 2, 32]} />;
    if (data.type === 'torus') Geometry = <torusGeometry args={data.args || [2, 0.5, 16, 100]} />;

    return (
        <group>
            <mesh
                ref={mesh}
                position={data.position}
                rotation={data.rotation}
                scale={data.scale}
                onClick={(e) => { e.stopPropagation(); onSelect(data.id); }}
            >
                {Geometry}
                <meshStandardMaterial
                    color={data.color}
                    roughness={0.3}
                    metalness={0.1}
                    emissive={isSelected ? "#444" : "#000"} // Highlight when selected
                />
            </mesh>

            {/* TRANSFORM CONTROLS (The "Gizmo") */}
            {isSelected && (
                <TransformControls
                    object={mesh}
                    mode="translate" // Can be switched to rotate/scale
                />
            )}
        </group>
    );
};

// 1. DEFINE THE PROPS INTERFACE
interface ThreeDBoardProps {
    initialScene?: any[]; // Optional prop for the AI-generated scene
}

// 2. USE THE INTERFACE IN THE COMPONENT
export default function ThreeDBoard({ initialScene }: ThreeDBoardProps) {
    // --- STATE ---
    const [sceneObjects, setSceneObjects] = useState<any[]>(initialScene || []); // The "Truth" of the world
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<'view' | 'edit'>('view');

    // 3. LISTEN FOR UPDATES
    // If the parent passes a new scene (e.g. from AI), update the state
    useEffect(() => {
        if (initialScene) {
            setSceneObjects(initialScene);
        }
    }, [initialScene]);

    // --- AI HANDLER ---
    const generate3DScene = async (text: string) => {
        setIsLoading(true);

        const fetchWithRetry = async (): Promise<any> => {
            const res = await fetch('/api/visualize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text, mode: '3d' })
            });
            const data = await res.json();

            if (data.status === 'loading') {
                console.log(`❄️ Model Waking Up... Waiting ${data.estimated_time}s`);
                await new Promise(r => setTimeout(r, (data.estimated_time * 1000) + 1000));
                return fetchWithRetry(); // RETRY
            }
            return data;
        };

        try {
            const data = await fetchWithRetry();

            if (data.status === 'success' && data.code.scene) {
                setSceneObjects(data.code.scene);
            }
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    // --- MANUAL CONTROLS ---
    const deleteSelected = () => {
        if (selectedId) {
            setSceneObjects(prev => prev.filter(o => o.id !== selectedId));
            setSelectedId(null);
        }
    };

    const handleClear = () => {
        if (confirm("Clear Scene?")) setSceneObjects([]);
    };

    return (
        <div className="w-full h-full relative bg-stone-900">

            {/* 3D CANVAS */}
            <Canvas
                shadows={false} // Disable shadows for max FPS
                dpr={[1, 1.5]}  // Cap resolution
                gl={{ antialias: false }} // Disable antialiasing (slight jagged edges, but MUCH faster)
                camera={{ position: [5, 5, 5], fov: 50 }}
            >
                {/* Lighting & Env */}
                <ambientLight intensity={0.5} />
                <Environment preset="city" />

                {/* The "Floor" */}
                <Grid infiniteGrid sectionColor="#555" cellColor="#333" position={[0, -0.01, 0]} args={[10, 10]} />

                {/* Render All Objects */}
                {sceneObjects.map((obj) => (
                    <SceneObject
                        key={obj.id}
                        data={obj}
                        isSelected={obj.id === selectedId}
                        onSelect={setSelectedId}
                    />
                ))}

                {/* Camera Controls */}
                <OrbitControls makeDefault />
            </Canvas>

            {/* --- UI OVERLAY --- */}

            {/* Toolbar */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
                <button
                    onClick={() => setSelectedId(null)}
                    className="p-3 rounded-lg hover:bg-white/20 text-white"
                    title="Deselect All"
                >
                    <MousePointer2 size={20} />
                </button>
                <div className="h-px bg-white/20 mx-2"></div>
                <button
                    onClick={deleteSelected}
                    className={`p-3 rounded-lg hover:bg-red-500/50 text-white ${!selectedId && 'opacity-30 cursor-not-allowed'}`}
                    title="Delete Selected"
                >
                    <Trash2 size={20} />
                </button>
                <button
                    onClick={handleClear}
                    className="p-3 rounded-lg hover:bg-red-500/50 text-white"
                    title="Clear All"
                >
                    <RotateCw size={20} />
                </button>
            </div>

            {/* Chat Bar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4">
                <form
                    onSubmit={(e) => { e.preventDefault(); if (input) { generate3DScene(input); setInput(""); } }}
                    className="bg-stone-800/80 backdrop-blur-xl p-2 rounded-[2rem] shadow-2xl flex items-center gap-2 border border-stone-700"
                >
                    <div className="p-3 bg-stone-700 rounded-full text-stone-400">
                        {isLoading ? <Loader2 size={20} className="animate-spin text-orange-500" /> : <Sparkles size={20} />}
                    </div>

                    <input
                        type="text"
                        className="flex-1 bg-transparent px-2 font-bold text-lg text-white outline-none placeholder:text-stone-500"
                        placeholder={isLoading ? "Updating Scene..." : "E.g., 'Make the sphere red'"}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />

                    <button type="submit" disabled={isLoading} className="p-3 bg-orange-600 text-white rounded-full hover:bg-orange-500 transition shadow-lg">
                        <Send size={18} />
                    </button>
                </form>
            </div>

            {/* Instructions */}
            <div className="absolute top-4 right-4 text-white/50 text-xs text-right pointer-events-none">
                <p>Left Click to Select</p>
                <p>Drag Arrows to Move</p>
                <p>Right Click to Orbit</p>
            </div>
        </div>
    );
}