"use client";
import React from 'react';
import { ScanFace, X } from 'lucide-react';

// Define the custom element for TypeScript
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': any;
        }
    }
}

export default function ArPet({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] bg-black/80 flex flex-col items-center justify-center p-4">
            <div className="bg-white w-full max-w-md h-[80vh] rounded-[2rem] relative overflow-hidden flex flex-col">

                {/* Header */}
                <div className="absolute top-4 left-0 w-full z-10 flex justify-between px-6">
                    <span className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">AR Mode</span>
                    <button onClick={onClose} className="bg-white/80 p-2 rounded-full hover:bg-red-50 text-red-500">
                        <X size={20} />
                    </button>
                </div>

                {/* The Google Model Viewer (This handles the AR Magic) */}
                <model-viewer
                    src="/pet.gltf"  // The same file you put in public
                    ios-src=""       // Optional: Add .usdz file here for better iPhone support
                    alt="Your 3D Pet"
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    camera-controls
                    auto-rotate
                    shadow-intensity="1"
                    style={{ width: '100%', height: '100%' }}
                >
                    <button slot="ar-button" className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 animate-bounce">
                        <ScanFace size={20} />
                        Place in Room
                    </button>
                </model-viewer>

            </div>
            <p className="text-white mt-4 text-sm font-medium">Point camera at a flat surface</p>
        </div>
    );
}