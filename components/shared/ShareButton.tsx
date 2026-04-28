"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export function ShareButton() {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: "Check out this vibe on InstaGif",
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    return (
        <button 
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:opacity-90 transition-all"
        >
            {copied ? (
                <>
                    <Check size={18} />
                    Copied to Clipboard!
                </>
            ) : (
                <>
                    <Share2 size={18} />
                    Share this Vibe
                </>
            )}
        </button>
    );
}
