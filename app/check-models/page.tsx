"use client";

import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function CheckModelsPage() {
    const [loading, setLoading] = useState(true);
    const [models, setModels] = useState<string[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/check-models")
            .then(res => res.json())
            .then(data => {
                if (data.error) setError(data.error);
                else setModels(data.models || []);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 font-sans">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-2xl w-full">
                <h1 className="text-2xl font-black mb-6">API Diagnostics</h1>

                {loading && (
                    <div className="flex items-center gap-2 text-stone-500">
                        <Loader2 className="animate-spin" /> Checking Google Servers...
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex gap-3 items-start">
                        <XCircle className="shrink-0 mt-1" />
                        <div>
                            <p className="font-bold">Connection Failed</p>
                            <p className="text-sm font-mono mt-1">{error}</p>
                            <p className="text-xs mt-2 text-red-400">Make sure your API Key is valid and has "Generative Language API" enabled in Google Cloud Console.</p>
                        </div>
                    </div>
                )}

                {!loading && !error && (
                    <div className="space-y-6">
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 flex items-center gap-3">
                            <CheckCircle />
                            <span className="font-bold">API Key is Active!</span>
                        </div>

                        <div>
                            <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-3">Available Models</p>
                            <div className="grid gap-2">
                                {models.map(model => (
                                    <div key={model} className="flex items-center justify-between bg-stone-50 p-3 rounded-lg border border-stone-200">
                                        <code className="font-bold text-stone-700">{model}</code>
                                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-bold">Active</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p className="text-sm text-stone-500 italic">
                            * Use the top model name in your <code>route.ts</code> file.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}