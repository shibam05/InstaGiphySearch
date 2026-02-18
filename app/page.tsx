import { CommunityTeaser } from "@/components/shared/CommunityTeaser";
import { ParticlesBackground } from "@/components/shared/ParticlesBackground";
import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";

export default function Home() {

    return (
        <div className="flex flex-col min-h-[calc(100vh-6rem)]">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">

                <ParticlesBackground />

                <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-xs font-medium backdrop-blur-sm border border-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    <Sparkles size={12} className="text-purple-400" />
                    <span>The Vibe Check for GIFs</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-linear-to-br from-white via-white/90 to-white/50">
                    Find Your <br /> <span className="italic font-serif font-normal text-white">Vibe.</span>
                </h1>

                <p className="text-muted-foreground text-lg md:text-xl max-w-lg mb-10">
                    Curated, trending, and community-driven GIFs for every mood.
                </p>

                {/* Hero Search */}
                <form action="/search" className="w-full max-w-md relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        name="q"
                        placeholder="Search for memes, cats, vibes..."
                        className="w-full bg-secondary/50 backdrop-blur-md border border-border rounded-full py-4 pl-12 pr-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all"
                    />
                </form>
            </section>

            {/* Community Teaser */}
            <CommunityTeaser />
        </div>
    );
}
