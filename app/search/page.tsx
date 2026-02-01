import { GiphyService } from "@/lib/giphy";
import { GifCard } from "@/components/shared/GifCard";
import { Metadata } from "next";
import { Search } from "lucide-react";
import Link from "next/link";

import { SearchInput } from "@/components/shared/SearchInput";

export const metadata: Metadata = {
    title: "Search - InstaGif",
    description: "Find the perfect GIF.",
};

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { q: queryParam } = await searchParams;
    const q = typeof queryParam === 'string' ? queryParam : '';
    const initialResults = q ? await GiphyService.search(q, 30) : { data: [] };

    return (
        <div className="container mx-auto px-4 pb-20">
            <div className="py-8">
                <div className="flex items-center gap-3 mb-8 text-black/50 dark:text-white/50 text-sm">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <span>/</span>
                    <span>Search</span>
                </div>

                <div className="mb-12">
                    <SearchInput initialQuery={q} />
                </div>


                {q && initialResults.data.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        <p>No vibes found for "{q}". Try something else.</p>
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {initialResults.data.map((gif: any) => (
                        <GifCard key={gif.id} gif={gif} />
                    ))}
                </div>
            </div>
        </div>
    );
}
