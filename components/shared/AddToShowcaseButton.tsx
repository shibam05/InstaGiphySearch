"use client";

import { useUserStore } from "@/lib/store";
import { PlusCircle, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AddToShowcaseButtonProps {
    id: string;
}

export function AddToShowcaseButton({ id }: AddToShowcaseButtonProps) {
    const { state } = useUserStore();
    const router = useRouter();
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        setIsAdded(state.addedGifs.some(g => g.id === id));
    }, [state.addedGifs, id]);

    if (isAdded) {
        return (
            <div className="flex items-center gap-2 text-green-500 font-medium p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                <Check size={20} />
                <span>Added to Showcase</span>
            </div>
        );
    }

    return (
        <button
            onClick={() => router.push(`/add?id=${id}`)}
            className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-3 rounded-xl font-medium hover:bg-secondary/80 transition-colors border border-border"
        >
            <PlusCircle size={18} />
            Add to Showcase
        </button>
    );
}
