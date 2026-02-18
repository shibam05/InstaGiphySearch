"use client";

import { useUserStore } from "@/lib/store";
import { GifCard } from "./GifCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CommunityTeaser() {
    const { userGifsDetails } = useUserStore();

    // Show up to 8 items
    const displayGifs = userGifsDetails.slice(0, 8);

    if (userGifsDetails.length === 0) {
        return (
            <section className="px-4 pb-20 container mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold tracking-tight">Community Picks</h2>
                    <Link href="/showcase" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                        View all <ArrowRight size={16} />
                    </Link>
                </div>
                <div className="text-center py-12 border border-dashed border-muted rounded-xl bg-muted/10">
                    <p className="text-muted-foreground mb-4">No community picks yet. Be the first to add one!</p>
                    <Link href="/add" className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#ff0069] to-[#7638fa] rounded-full hover:opacity-90 transition-opacity shadow-md">
                        Add a GIF
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="px-4 pb-20 container mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Community Picks</h2>
                <Link href="/showcase" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                    View all <ArrowRight size={16} />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {displayGifs.map((gif) => (
                    <GifCard key={gif.id} gif={gif} />
                ))}
            </div>
        </section>
    );
}
