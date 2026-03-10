"use client";

import React, { useState, useRef, useEffect } from "react";
import Sidebar from "@/app/components/Sidebar";
import { Send, Sparkles, User, Bot, Eye, X, Plus, MessageSquare, Trash2, Menu, Mic, Paperclip, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const InlineLesson = dynamic(() => import("@/app/components/InlineLesson"), {
    ssr: false,
    loading: () => <div className="h-64 flex items-center justify-center bg-stone-100 rounded-xl text-stone-400">Loading Visualization...</div>
});
import ReactMarkdown from "react-markdown";

// --- TYPES ---
type Attachment = { mimeType: string; data: string; name: string };
type Message = { role: 'user' | 'ai'; content: string; visualData?: any; attachment?: Attachment };
type ChatSession = { id: string; title: string; date: string; messages: Message[] };

export default function LearnPage() {
    // --- STATE ---
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [expandedVisualId, setExpandedVisualId] = useState<number | null>(null);
    const [showHistory, setShowHistory] = useState(true);

    // NEW STATE FOR UPLOAD & MIC
    const [attachment, setAttachment] = useState<Attachment | null>(null);
    const [isListening, setIsListening] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- LOAD & SAVE LOGIC (Same as before) ---
    useEffect(() => {
        const saved = localStorage.getItem('gyanSetu_chats');
        if (saved) {
            const parsed = JSON.parse(saved);
            setSessions(parsed);
            if (parsed.length > 0) setCurrentSessionId(parsed[0].id);
        } else {
            createNewChat();
        }
    }, []);

    useEffect(() => {
        if (sessions.length > 0) localStorage.setItem('gyanSetu_chats', JSON.stringify(sessions));
    }, [sessions]);

    const currentMessages = sessions.find(s => s.id === currentSessionId)?.messages || [];

    const createNewChat = () => {
        const newChat: ChatSession = { id: Date.now().toString(), title: "New Chat", date: new Date().toLocaleDateString(), messages: [] };
        setSessions(prev => [newChat, ...prev]);
        setCurrentSessionId(newChat.id);
        setExpandedVisualId(null);
    };

    const deleteChat = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const updated = sessions.filter(s => s.id !== id);
        setSessions(updated);
        localStorage.setItem('gyanSetu_chats', JSON.stringify(updated));
        if (currentSessionId === id) {
            if (updated.length > 0) setCurrentSessionId(updated[0].id);
            else createNewChat();
        }
    };

    const updateCurrentSession = (newMessages: Message[]) => {
        setSessions(prev => prev.map(session => {
            if (session.id === currentSessionId) {
                const title = session.messages.length === 0 && newMessages.length > 0 ? newMessages[0].content.slice(0, 30) + "..." : session.title;
                return { ...session, messages: newMessages, title };
            }
            return session;
        }));
    };

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(scrollToBottom, [currentMessages, expandedVisualId]);

    // --- FEATURE 1: MICROPHONE INPUT ---
    const toggleListening = () => {
        if (isListening) {
            (window as any).recognition?.stop();
            setIsListening(false);
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support voice input. Try Chrome.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(prev => prev + (prev ? " " : "") + transcript);
        };

        (window as any).recognition = recognition;
        recognition.start();
    };

    // --- FEATURE 2: FILE UPLOAD (Base64) ---
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Limit size to 4MB (Serverless Function Limits)
        if (file.size > 4 * 1024 * 1024) {
            alert("File is too large! Please upload images under 4MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            // Remove the "data:image/png;base64," prefix for the API
            const base64Data = base64String.split(',')[1];

            setAttachment({
                mimeType: file.type,
                data: base64Data,
                name: file.name
            });
        };
        reader.readAsDataURL(file);
    };

    // --- SEND MESSAGE ---
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!input.trim() && !attachment) || !currentSessionId) return;

        const userMsg: Message = {
            role: "user",
            content: input || (attachment ? "Analyze this file" : ""),
            attachment: attachment || undefined
        };

        const updatedHistory = [...currentMessages, userMsg];
        updateCurrentSession(updatedHistory);

        // Reset Inputs
        setInput("");
        setAttachment(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setIsLoading(true);

        try {
            const res = await fetch("/api/explain", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ history: updatedHistory })
            });
            const data = await res.json();

            console.log("AI Response:", data); // Debug log

            const aiMsg: Message = {
                role: "ai",
                content: data.explanation || data.error || "No response",
                visualData: data.strategy !== "NONE" ? data : null
            };

            updateCurrentSession([...updatedHistory, aiMsg]);
        } catch (error) {
            console.error("Chat Error:", error);
            const errorMsg: Message = {
                role: "ai",
                content: "Sorry, there was an error processing your request.",
            };
            updateCurrentSession([...updatedHistory, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#FDFBF7] font-sans text-stone-800">
            <Sidebar />

            <div className="pl-24 w-full h-screen flex">
                {/* HISTORY SIDEBAR */}
                <div className={`${showHistory ? 'w-80' : 'w-0'} bg-stone-50 border-r border-stone-200 transition-all duration-300 overflow-hidden flex flex-col`}>
                    <div className="p-4">
                        <button onClick={createNewChat} className="w-full flex items-center gap-2 bg-stone-900 text-white p-3 rounded-xl font-bold hover:bg-stone-800 transition shadow-lg shadow-stone-200">
                            <Plus size={20} /> New Chat
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
                        {sessions.map(session => (
                            <div key={session.id} onClick={() => setCurrentSessionId(session.id)} className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition text-sm font-medium ${currentSessionId === session.id ? 'bg-white shadow-md border border-stone-100 text-stone-900' : 'text-stone-500 hover:bg-stone-100'}`}>
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <MessageSquare size={16} className={currentSessionId === session.id ? "text-orange-500" : "text-stone-300"} />
                                    <span className="truncate">{session.title}</span>
                                </div>
                                <button onClick={(e) => deleteChat(e, session.id)} className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-500 transition p-1"><Trash2 size={14} /></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MAIN CHAT */}
                <div className="flex-1 flex flex-col relative bg-white/50">
                    <div className="absolute top-4 left-4 z-10"><button onClick={() => setShowHistory(!showHistory)} className="p-2 text-stone-400 hover:bg-stone-100 rounded-lg"><Menu size={20} /></button></div>

                    {/* HEADER */}
                    <div className="h-16 flex items-center justify-center border-b border-stone-100 bg-white/80 backdrop-blur-sm">
                        <h1 className="font-bold text-stone-700 flex items-center gap-2"><Sparkles size={16} className="text-orange-500" /> {sessions.find(s => s.id === currentSessionId)?.title || "New Chat"}</h1>
                    </div>

                    {/* MESSAGES */}
                    <div className="flex-1 overflow-y-auto space-y-6 p-6">
                        {currentMessages.length === 0 && (
                            <div className="text-center mt-32 text-stone-400">
                                <p className="text-lg">Upload notes or ask a question.</p>
                            </div>
                        )}
                        {currentMessages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-stone-900 text-white' : 'bg-orange-500 text-white'}`}>{msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}</div>
                                <div className={`p-4 rounded-2xl max-w-2xl shadow-sm ${msg.role === 'user' ? 'bg-white border border-stone-200' : 'bg-white border border-orange-100'}`}>

                                    {/* SHOW ATTACHMENT IF ANY */}
                                    {msg.attachment && (
                                        <div className="mb-3 p-2 bg-stone-100 rounded-lg flex items-center gap-2 text-xs font-bold text-stone-600 border border-stone-200">
                                            {msg.attachment.mimeType.startsWith('image') ? <ImageIcon size={16} /> : <FileText size={16} />}
                                            {msg.attachment.name}
                                        </div>
                                    )}

                                    <div className="prose prose-stone prose-sm"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
                                    {msg.visualData && (
                                        <div className="mt-4">
                                            {expandedVisualId === idx ? (
                                                <div className="animate-in fade-in zoom-in-95 duration-300">
                                                    <div className="flex justify-between items-center mb-2"><span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Lesson</span><button onClick={() => setExpandedVisualId(null)} className="text-stone-400 hover:text-red-500"><X size={16} /></button></div>
                                                    <InlineLesson data={msg.visualData} />
                                                </div>
                                            ) : (
                                                <button onClick={() => setExpandedVisualId(idx)} className="flex items-center gap-2 bg-stone-50 hover:bg-orange-50 text-stone-700 hover:text-orange-600 px-4 py-2 rounded-lg text-xs font-bold transition w-full justify-center border border-stone-200 hover:border-orange-200"><Eye size={14} /> Show Visualization</button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && <div className="flex items-center gap-2 text-stone-400 text-sm pl-12"><Loader2 className="animate-spin" size={14} /> Thinking...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* INPUT AREA */}
                    <div className="p-4 bg-white border-t border-stone-100">
                        {/* ATTACHMENT PREVIEW */}
                        {attachment && (
                            <div className="mb-2 inline-flex items-center gap-2 bg-stone-100 px-3 py-1 rounded-full text-xs font-bold text-stone-600 animate-in slide-in-from-bottom-2">
                                <span className="max-w-[200px] truncate">{attachment.name}</span>
                                <button onClick={() => setAttachment(null)} className="hover:text-red-500"><X size={14} /></button>
                            </div>
                        )}

                        <form onSubmit={handleSend} className="bg-stone-50 p-2 rounded-[2rem] border border-stone-200 flex items-center gap-2 focus-within:ring-2 ring-orange-100 transition shadow-sm">

                            {/* FILE UPLOAD */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="hidden"
                                accept="image/*,application/pdf"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-3 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full transition"
                                title="Upload File"
                            >
                                <Paperclip size={18} />
                            </button>

                            {/* TEXT INPUT */}
                            <input
                                type="text"
                                className="flex-1 bg-transparent px-2 py-2 font-medium outline-none placeholder:text-stone-400 text-stone-700"
                                placeholder={isListening ? "Listening..." : "Type or speak..."}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />

                            {/* MIC BUTTON */}
                            <button
                                type="button"
                                onClick={toggleListening}
                                className={`p-3 rounded-full transition ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-stone-400 hover:text-stone-700 hover:bg-stone-200'}`}
                                title="Voice Input"
                            >
                                <Mic size={18} />
                            </button>

                            {/* SEND BUTTON */}
                            <button disabled={isLoading || (!input && !attachment)} className="p-3 bg-stone-900 text-white rounded-full hover:bg-stone-700 transition disabled:opacity-50 shadow-md">
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}