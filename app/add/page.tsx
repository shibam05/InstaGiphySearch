"use client";

import { useEffect, useState, useCallback } from "react";
import { useUserStore } from "@/lib/store";
import { GiphyService, GifData } from "@/lib/giphy";
import { GifCard } from "@/components/shared/GifCard";
import { Search, Plus, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Suspense } from "react";

function AddGifContent() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [previewGif, setPreviewGif] = useState<GifData | null>(null);
    const [tags, setTags] = useState("");
    const { addGif } = useUserStore();
    const router = useRouter();
    const searchParams = useSearchParams();

    const fetchGif = useCallback(async (searchTerm: string) => {
        if (!searchTerm) return;
        setLoading(true);
        setPreviewGif(null);

        // 1. Try get by ID
        const byId = await GiphyService.getById(searchTerm);
        if (byId) {
            setPreviewGif(byId);
        } else {
            // 2. Fallback search
            const search = await GiphyService.search(searchTerm, 1);
            if (search.data && search.data.length > 0) {
                setPreviewGif(search.data[0]);
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        const idParam = searchParams.get("id");
        if (idParam) {
            setQuery(idParam);
            fetchGif(idParam);
        }
    }, [searchParams, fetchGif]);

    const handlePreview = async (e: React.FormEvent) => {
        e.preventDefault();
        fetchGif(query);
    };

    const handleAdd = () => {
        if (!previewGif) return;
        const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
        addGif(previewGif.id, tagList);
        router.push('/showcase');
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-4">Add the Vibe</h1>
                <p className="text-muted-foreground">Search for a GIF or paste a Giphy ID to add it to the community showcase.</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-sm">
                <form onSubmit={handlePreview} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Search or Giphy ID
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="e.g. 'cat', 'funny' or ID"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                            </button>
                        </div>
                    </div>

                    {previewGif && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="rounded-xl overflow-hidden bg-black/5 aspect-video flex items-center justify-center border border-border w-[60%] mx-auto">
                                <GifCard gif={previewGif} />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium leading-none">
                                    Add Tags (Optional)
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {tags.split(',').map(t => t.trim()).filter(Boolean).map((tag, i) => (
                                        <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={tags}
                                    onChange={e => setTags(e.target.value)}
                                    placeholder="Type tags separated by commas... (e.g. funny, reaction, cat)"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                                <p className="text-[0.8rem] text-muted-foreground">
                                    Separate tags with commas.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleAdd}
                                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-[#ff0069] to-[#7638fa] text-white hover:opacity-90 h-11 px-8 shadow-md"
                            >
                                <Plus size={18} className="mr-2" /> Add to Showcase
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default function AddGifPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center"><Loader2 className="animate-spin mx-auto" /></div>}>
            <AddGifContent />
        </Suspense>
    );
}
