"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mic, Send, Eraser, Sparkles, PenTool, MousePointer2, Trash2, Loader2, Highlighter, SprayCan, Wand2 } from "lucide-react";

export default function FabricBoard() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [fabricCanvas, setFabricCanvas] = useState<any>(null);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // TOOL STATES
    const [tool, setTool] = useState<'select' | 'pencil' | 'marker' | 'spray'>('pencil');
    const [color, setColor] = useState('#000000');
    const [smartMode, setSmartMode] = useState(false); // The "iPad" Auto-correct toggle

    // --- INITIALIZE ---
    useEffect(() => {
        let canvasInstance: any = null;
        const initFabric = async () => {
            const fabricModule = await import("fabric");
            const fabric = fabricModule.fabric || fabricModule.default || fabricModule;
            (window as any).fabric = fabric;

            if (canvasRef.current) {
                if ((window as any).canvas2d) (window as any).canvas2d.dispose();

                canvasInstance = new fabric.Canvas(canvasRef.current, {
                    isDrawingMode: true,
                    backgroundColor: '#ffffff',
                });

                // Set Size
                canvasInstance.setWidth(window.innerWidth - 112);
                canvasInstance.setHeight(window.innerHeight);

                // --- SMART SHAPE RECOGNITION (iPad Logic) ---
                canvasInstance.on('path:created', (e: any) => {
                    // We need to access the state ref, doing it via window for quick hackathon access
                    if (!(window as any).isSmartMode) return;

                    const path = e.path;
                    const { left, top, width, height } = path;

                    // Simple Geometric Logic
                    const fabric = (window as any).fabric;
                    let newObj = null;

                    // 1. Detect Line (Height is very small compared to width, or vice versa)
                    if (width < 5 || height < 5) {
                        newObj = new fabric.Line([left, top, left + width, top + height], {
                            stroke: path.stroke, strokeWidth: path.strokeWidth
                        });
                    }
                    // 2. Detect Circle (Width roughly equals Height)
                    else if (Math.abs(width - height) < 20) {
                        newObj = new fabric.Circle({
                            radius: width / 2, left, top, fill: 'transparent', stroke: path.stroke, strokeWidth: path.strokeWidth
                        });
                    }
                    // 3. Detect Rect (Otherwise)
                    else {
                        newObj = new fabric.Rect({
                            width, height, left, top, fill: 'transparent', stroke: path.stroke, strokeWidth: path.strokeWidth
                        });
                    }

                    if (newObj) {
                        canvasInstance.remove(path); // Remove messy hand-drawing
                        canvasInstance.add(newObj);  // Add perfect shape
                        canvasInstance.renderAll();
                    }
                });

                setFabricCanvas(canvasInstance);
                (window as any).canvas2d = canvasInstance;
            }
        };
        initFabric();

        const handleResize = () => {
            if ((window as any).canvas2d) {
                (window as any).canvas2d.setWidth(window.innerWidth - 112);
                (window as any).canvas2d.setHeight(window.innerHeight);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- TOOL SWITCHING ---
    useEffect(() => {
        if (!fabricCanvas) return;
        const fabric = (window as any).fabric;

        // Global flag for the event listener to read
        (window as any).isSmartMode = smartMode;

        if (tool === 'select') {
            fabricCanvas.isDrawingMode = false;
        } else {
            fabricCanvas.isDrawingMode = true;

            // BRUSH LOGIC
            if (tool === 'pencil') {
                fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
                fabricCanvas.freeDrawingBrush.width = 3;
                fabricCanvas.freeDrawingBrush.color = color;
            } else if (tool === 'marker') {
                fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
                fabricCanvas.freeDrawingBrush.width = 15;
                fabricCanvas.freeDrawingBrush.color = color + "80"; // 50% opacity hex
            } else if (tool === 'spray') {
                fabricCanvas.freeDrawingBrush = new fabric.SprayBrush(fabricCanvas);
                fabricCanvas.freeDrawingBrush.width = 20;
                fabricCanvas.freeDrawingBrush.color = color;
            }
        }
    }, [tool, color, smartMode, fabricCanvas]);

    // --- AI FETCH (SVG) ---
    const generateVisual = async (text: string) => {
        if (!fabricCanvas) return;
        setIsLoading(true);

        const fetchWithRetry = async (): Promise<any> => {
            const res = await fetch('/api/visualize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text, mode: '2d' })
            });
            const data = await res.json();

            // IF LOADING: Wait and Recursive Call
            if (data.status === 'loading') {
                console.log(`❄️ Model Cold Boot. Waiting ${data.estimated_time}s...`);
                // Wait for the estimated time (plus buffer)
                await new Promise(r => setTimeout(r, (data.estimated_time * 1000) + 1000));
                return fetchWithRetry(); // RETRY
            }
            return data;
        };

        try {
            const data = await fetchWithRetry();

            if (data.status === 'success' && data.type === 'svg') {
                (window as any).fabric.loadSVGFromString(data.code, (objects: any[], options: any) => {
                    const obj = (window as any).fabric.util.groupSVGElements(objects, options);
                    obj.scaleToWidth(300);
                    obj.set({ left: fabricCanvas.width / 2, top: fabricCanvas.height / 2, originX: 'center', originY: 'center' });
                    fabricCanvas.add(obj);
                    fabricCanvas.renderAll();
                });
            }
        } catch (e) {
            console.error("Final Error:", e);
            alert("The AI is too busy right now. Please try again in 1 minute.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full relative flex flex-col bg-[#fdfbf7]">
            {/* GRID BACKGROUND */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            {/* LEFT TOOLBAR (iPad Style) */}
            <div className="absolute top-24 left-6 z-20 flex flex-col gap-2 bg-white shadow-xl border border-stone-200 rounded-2xl p-2">

                {/* 1. SELECT */}
                <button onClick={() => setTool('select')} className={`p-3 rounded-xl transition ${tool === 'select' ? 'bg-indigo-100 text-indigo-600' : 'text-stone-400'}`}>
                    <MousePointer2 size={24} />
                </button>
                <div className="h-px bg-stone-200 w-full my-1"></div>

                {/* 2. BRUSHES */}
                <button onClick={() => setTool('pencil')} className={`p-3 rounded-xl transition ${tool === 'pencil' ? 'bg-indigo-100 text-indigo-600' : 'text-stone-400'}`}>
                    <PenTool size={24} />
                </button>
                <button onClick={() => setTool('marker')} className={`p-3 rounded-xl transition ${tool === 'marker' ? 'bg-indigo-100 text-indigo-600' : 'text-stone-400'}`}>
                    <Highlighter size={24} />
                </button>
                <button onClick={() => setTool('spray')} className={`p-3 rounded-xl transition ${tool === 'spray' ? 'bg-indigo-100 text-indigo-600' : 'text-stone-400'}`}>
                    <SprayCan size={24} />
                </button>

                <div className="h-px bg-stone-200 w-full my-1"></div>

                {/* 3. AUTO CORRECT TOGGLE */}
                <button
                    onClick={() => setSmartMode(!smartMode)}
                    className={`p-3 rounded-xl transition relative ${smartMode ? 'bg-purple-100 text-purple-600' : 'text-stone-400'}`}
                    title="Smart Shape Mode (Auto-Correct)"
                >
                    <Wand2 size={24} />
                    {smartMode && <div className="absolute top-2 right-2 w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>}
                </button>

                <div className="h-px bg-stone-200 w-full my-1"></div>

                {/* 4. CLEAR */}
                <button onClick={() => fabricCanvas?.clear()} className="p-3 rounded-xl text-red-400 hover:bg-red-50">
                    <Trash2 size={24} />
                </button>
            </div>

            {/* COLOR PALETTE (Bottom Left) */}
            <div className="absolute bottom-32 left-6 z-20 flex flex-col gap-2 bg-white shadow-lg border border-stone-200 rounded-full p-2">
                {['#000000', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'].map(c => (
                    <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition ${color === c ? 'border-stone-900 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c }}
                    />
                ))}
            </div>

            {/* CANVAS */}
            <div className="flex-1 z-10">
                <canvas ref={canvasRef} />
            </div>

            {/* AI BAR (Bottom) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-20">
                <form onSubmit={(e) => { e.preventDefault(); if (input) { generateVisual(input); setInput(""); } }}
                    className="bg-white p-2 rounded-[2rem] shadow-2xl flex items-center gap-2 border border-stone-100">
                    <div className="p-3 bg-stone-100 rounded-full">
                        {isLoading ? <Loader2 className="animate-spin text-orange-500" /> : <Sparkles />}
                    </div>
                    <input type="text" className="flex-1 bg-transparent px-2 font-bold text-lg outline-none" placeholder="Describe a diagram to draw..." value={input} onChange={(e) => setInput(e.target.value)} />
                    <button type="submit" className="p-3 bg-black text-white rounded-full"><Send size={18} /></button>
                </form>
            </div>
        </div>
    );
}