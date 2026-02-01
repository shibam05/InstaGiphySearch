import { Search } from "lucide-react";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 pb-20">
            <div className="py-8">
                <div className="flex items-center gap-3 mb-6 text-muted-foreground">
                    <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                    <span>/</span>
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                </div>

                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <Search className="animate-pulse" />
                    <span className="h-8 w-48 bg-muted rounded animate-pulse" />
                </h1>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} className="aspect-[4/3] w-full rounded-xl bg-muted/30 animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    );
}
