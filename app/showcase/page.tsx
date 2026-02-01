import { GiphyService } from "@/lib/giphy";
import { ShowcaseFeed } from "@/components/shared/ShowcaseFeed";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Showcase - InstaGif",
    description: "Explore trending and community curated GIFs.",
};

export default async function ShowcasePage() {
    const trending = await GiphyService.getTrending(40);

    return (
        <div className="container mx-auto px-4 pb-20">
            <div className="py-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">The Showcase</h1>
                <p className="text-muted-foreground">Discover what's trending and what the community is vibing with.</p>
            </div>

            <ShowcaseFeed initialTrending={trending.data || []} />
        </div>
    );
}
