"use client";

import { GifData } from "@/lib/giphy";
import { Heart, Flag, Share2, CornerUpRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/lib/store";

interface GifCardProps {
    gif: GifData;
    className?: string;
}

export function GifCard({ gif, className }: GifCardProps) {
    const { isLiked, toggleLike, reportGif } = useUserStore();
    const liked = isLiked(gif.id);
    const [reported, setReported] = useState(false);

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleLike(gif.id);
    };

    const handleReport = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Report this GIF?")) {
            reportGif(gif.id);
            setReported(true);
        }
    };

    if (reported) return null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn("group relative rounded-xl overflow-hidden cursor-pointer bg-muted/20", className)}
        >
            <div className="aspect-[4/3] w-full relative">
                {/* Use standard img for simplicity and avoiding Next.js config complexity with external domains for now */}
                <img
                    src={gif.images.fixed_height.url}
                    alt={gif.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <div className="flex items-center justify-between text-white">
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm truncate max-w-[150px]">{gif.title || "Untitled GIF"}</span>
                        {gif.user && (
                            <span className="text-xs text-white/70 flex items-center gap-1">
                                @{gif.user.username}
                                {gif.user.is_verified && <CornerUpRight size={10} />}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleLike}
                            className={cn("p-2 rounded-full backdrop-blur-sm transition-colors hover:bg-white/20", liked ? "text-red-500 fill-current" : "text-white")}
                        >
                            <Heart size={18} fill={liked ? "currentColor" : "none"} />
                        </button>
                        <button
                            onClick={handleReport}
                            className="p-2 rounded-full backdrop-blur-sm transition-colors hover:bg-white/20 text-white"
                        >
                            <Flag size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
