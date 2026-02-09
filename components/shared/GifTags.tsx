"use client";

import { useUserStore } from "@/lib/store";
import { Tag } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface GifTagsProps {
    id: string; // Giphy ID
}

export function GifTags({ id }: GifTagsProps) {
    const { state } = useUserStore();
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        // Find if we have local tags for this GIF
        const localGif = state.addedGifs.find(g => g.id === id);
        if (localGif && localGif.customTags) {
            setTags(localGif.customTags);
        }
    }, [id, state.addedGifs]);

    if (tags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mt-4 items-center">
            <Tag size={16} className="text-muted-foreground mr-1" />
            {tags.map((tag, i) => (
                <Link
                    key={i}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                    #{tag}
                </Link>
            ))}
        </div>
    );
}
