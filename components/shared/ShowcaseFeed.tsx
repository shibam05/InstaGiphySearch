"use client";

import { GifData } from "@/lib/giphy";
import { useUserStore } from "@/lib/store";
import { GifCard } from "./GifCard";
import { useEffect, useState } from "react";


export function ShowcaseFeed({ initialTrending }: { initialTrending: GifData[] }) {
    const { userGifsDetails } = useUserStore();
    const [activeTab, setActiveTab] = useState<'trending' | 'community'>('community');

    // We can switch between views or merge them. 
    // For 'trending', we show the API results.
    // For 'community', we show the local store results.

    return (
        <div className="space-y-8">
            {/* Tabs */}
            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={() => setActiveTab('community')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'community'
                        ? 'bg-gradient-to-r from-[#ff0069] to-[#7638fa] text-white shadow-lg scale-105'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                >
                    Community Picks ({userGifsDetails.length})
                </button>
                <button
                    onClick={() => setActiveTab('trending')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'trending'
                        ? 'bg-gradient-to-r from-[#ff0069] to-[#7638fa] text-white shadow-lg scale-105'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                >
                    Trending
                </button>
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'trending' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {initialTrending.map(gif => (
                            <GifCard key={gif.id} gif={gif} />
                        ))}
                    </div>
                ) : (
                    state.connectionError ? (
                        <div className="text-center py-20 border border-dashed border-red-500/30 rounded-xl bg-red-500/5">
                            <p className="text-red-400 font-medium mb-2">Unable to connect to Community Picks.</p>
                            <p className="text-muted-foreground text-sm">Please disable your Ad Blocker or Privacy Shield to see these vibes.</p>
                        </div>
                    ) : state.isLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="aspect-[4/3] bg-muted animate-pulse rounded-xl"></div>
                            ))}
                        </div>
                    ) : userGifsDetails.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {userGifsDetails.map(gif => (
                                <GifCard key={gif.id} gif={gif} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-muted-foreground">
                            <p>No community vibes yet.</p>
                            <p className="text-sm">Be the first to add one!</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
