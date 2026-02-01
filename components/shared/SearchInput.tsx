"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchInput({ initialQuery = "" }: { initialQuery?: string }) {
    const [query, setQuery] = useState(initialQuery);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        } else {
            router.push('/search');
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground">
                <Search size={24} />
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What's the vibe?"
                className="w-full bg-secondary/50 backdrop-blur-md border border-border rounded-full py-4 pl-12 pr-4 text-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all"
                autoFocus={!initialQuery}
            />
        </form>
    );
}
