"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

// Preload the model so it doesn't pop in late
useGLTF.preload("/pet.gltf"); // Updated to match previous file usage

function PetModel({ status, emotion }: { status: string, emotion: string }) {
    // This is where your actual GLTF model goes. 
    // For now, using a simple mesh to guarantee speed for testing.
    return (
        <mesh scale={2}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
                color={status === "sick" ? "#86efac" : "#fbbf24"}
                roughness={0.3}
            />
        </mesh>
    );
}

export default function PetCanvas({ level, vit }: { level: number, vit: number }) {
    const isSick = vit < 4;
    const emotion = level > 5 ? "happy" : "normal";

    return (
        <div className="w-full h-full relative">
            <Canvas
                dpr={[1, 1.5]} // Cap resolution (prevents lag on 4K screens)
                shadows={false} // Disable shadows for speed
                frameloop="demand" // CRITICAL: Only render when needed
                camera={{ fov: 50, position: [0, 0, 5] }}
            >
                <Suspense fallback={null}>
                    <Stage environment="city" intensity={0.5} adjustCamera={false}>
                        <PetModel status={isSick ? "sick" : "healthy"} emotion={emotion} />
                    </Stage>
                </Suspense>

                <OrbitControls
                    makeDefault
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={false} // Auto-rotate causes constant rendering, disable it for speed
                />
            </Canvas>
        </div>
    );
}