"use client";

import { useUserStore } from "@/lib/store";
import { GifCard } from "./GifCard";
import { Users } from "lucide-react";

export function LocalSearchResults({ query }: { query: string }) {
    const { userGifsDetails, state } = useUserStore();

    if (!query) return null;

    const lowerQuery = query.toLowerCase();

    // Filter added GIFs where title or tags match the query
    const matchingIds = state.addedGifs
        .filter(ag => {
            const tagMatch = ag.customTags?.some(t => t.toLowerCase().includes(lowerQuery));
            // We only have IDs and tags in 'state.addedGifs'. 
            // Titles are in 'userGifsDetails'.
            // But we can filter by ID presence efficiently later, 
            // let's start with tag matching which is robust for this requirement.
            return tagMatch;
        })
        .map(ag => ag.id);

    // Also filter details by title if we have them
    const matchingDetails = userGifsDetails.filter(gif => {
        const titleMatch = gif.title?.toLowerCase().includes(lowerQuery);
        const isTagMatch = matchingIds.includes(gif.id);
        return titleMatch || isTagMatch;
    });

    if (matchingDetails.length === 0) return null;

    return (
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                <Users size={20} />
                Community Picks for "{query}"
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {matchingDetails.map(gif => (
                    <GifCard key={gif.id} gif={gif} />
                ))}
            </div>
            <div className="my-8 border-b border-border/50" />
        </div>
    );
}
