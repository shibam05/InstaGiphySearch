
import { GiphyService } from "@/lib/giphy";
import { ArrowLeft, User, Calendar, Star, Share2, ExternalLink } from "lucide-react";
import { GifTags } from "@/components/shared/GifTags";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "GIF Details - InstaGif",
    description: "View GIF details and metadata.",
};

export default async function GifDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const gif = await GiphyService.getById(id);

    if (!gif) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">GIF Not Found</h1>
                <Link href="/" className="text-primary hover:underline">
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 pb-20 max-w-5xl">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Back to Feed</span>
            </Link>

            <div className="grid md:grid-cols-[1.5fr_1fr] gap-8 md:gap-12">
                {/* Left Column: Image */}
                <div className="space-y-4">
                    <div className="rounded-2xl overflow-hidden bg-black/5 border border-border/50 shadow-2xl relative group">
                        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                        <img
                            src={gif.images.original.url}
                            alt={gif.title}
                            className="w-full h-auto object-contain max-h-[70vh] mx-auto relative z-10"
                        />
                    </div>
                    {/* Mobile only actions could go here */}
                </div>

                {/* Right Column: Details */}
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                            {gif.title || "Untitled GIF"}
                        </h1>
                        <div className="flex items-center gap-3 text-muted-foreground">
                            {gif.rating && (
                                <span className="uppercase text-xs font-bold bg-muted px-2 py-1 rounded">
                                    {gif.rating}
                                </span>
                            )}
                            {gif.import_datetime && (
                                <span className="text-sm flex items-center gap-1">
                                    <Calendar size={14} />
                                    {new Date(gif.import_datetime).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                        <GifTags id={gif.id} />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border shadow-sm">
                        <div className="flex items-center gap-3">
                            {gif.user?.avatar_url ? (
                                <img
                                    src={gif.user.avatar_url}
                                    alt={gif.user.username}
                                    className="w-12 h-12 rounded-full border border-border"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                                    <User size={24} className="text-muted-foreground" />
                                </div>
                            )}
                            <div>
                                <p className="font-semibold">{gif.user?.display_name || "Unknown User"}</p>
                                <p className="text-sm text-muted-foreground">@{gif.user?.username || "anonymous"}</p>
                            </div>
                        </div>
                        {gif.user?.profile_url && (
                            <a
                                href={gif.user.profile_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-muted rounded-full transition-colors"
                            >
                                <ExternalLink size={20} />
                            </a>
                        )}
                    </div>

                    <div className="space-y-4">
                        {/* We could add generic share functionality here */}
                        <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:opacity-90 transition-opacity">
                            <Share2 size={18} />
                            Share this Vibe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
