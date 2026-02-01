"use client";

import Link from "next/link";
import { Search, PlusCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const router = useRouter();

    // Simple scroll effect
    if (typeof window !== "undefined") {
        window.addEventListener("scroll", () => {
            setIsScrolled(window.scrollY > 10);
        });
    }

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                isScrolled ? "bg-background/80 backdrop-blur-md border-border py-2" : "bg-transparent py-4"
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                        <Sparkles size={20} />
                    </div>
                    <span className="font-bold text-xl tracking-tight">InstaGif</span>
                </Link>

                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/" className="hover:text-primary transition-colors">
                            Home
                        </Link>
                        <Link href="/showcase" className="hover:text-primary transition-colors">
                            Showcase
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/search"
                            className="p-2 hover:bg-muted rounded-full transition-colors text-foreground/80 hover:text-foreground"
                            aria-label="Go to Search"
                        >
                            <Search size={20} />
                        </Link>
                        <Link
                            href="/add"
                            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            <PlusCircle size={16} />
                            <span className="hidden sm:inline">Add GIF</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
