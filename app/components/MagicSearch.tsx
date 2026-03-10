"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function MagicSearch() {
    const [showBtn, setShowBtn] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [selectedText, setSelectedText] = useState("");

    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection();
            const text = selection?.toString().trim();

            if (text && text.length > 0) {
                const range = selection?.getRangeAt(0);
                const rect = range?.getBoundingClientRect();

                if (rect) {
                    setSelectedText(text);
                    setPosition({
                        x: rect.left + window.scrollX + (rect.width / 2),
                        y: rect.top + window.scrollY - 40
                    });
                    setShowBtn(true);
                }
            } else {
                setShowBtn(false);
            }
        };

        // Listen for mouseup (when user finishes selecting)
        document.addEventListener("mouseup", handleSelection);
        return () => document.removeEventListener("mouseup", handleSelection);
    }, []);

    const handleSearch = () => {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedText)}`, '_blank');
        setShowBtn(false);
    };

    if (!showBtn) return null;

    return (
        <button
            onClick={handleSearch}
            style={{ top: position.y, left: position.x }}
            className="absolute transform -translate-x-1/2 z-[9999] bg-black text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 hover:scale-110 transition-all cursor-pointer animate-bounce-short"
        >
            <Search size={14} />
            <span className="text-xs font-bold">Search Magic</span>
        </button>
    );
}