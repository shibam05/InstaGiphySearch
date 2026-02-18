"use client"

import { useUserStore } from "@/lib/store";
import { Tag, Edit2, X, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface GifTagsProps {
    id: string; // Giphy ID
}

export function GifTags({ id }: GifTagsProps) {
    const { state, updateTags } = useUserStore();
    const [tags, setTags] = useState<string[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editTags, setEditTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        // Find if we have local tags for this GIF
        const localGif = state.addedGifs.find(g => g.id === id);
        if (localGif && localGif.customTags) {
            setTags(localGif.customTags);
            setEditTags(localGif.customTags);
        }
    }, [id, state.addedGifs]);

    const toTitleCase = (str: string) => {
        return str.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };

    const handleSave = async () => {
        if (inputValue.trim()) {
            // Add pending input before saving if user forgot to hit enter
            await updateTags(id, [...editTags, inputValue.trim()]);
        } else {
            await updateTags(id, editTags);
        }
        setIsEditing(false);
        setInputValue("");
    };

    const addTag = (e: React.KeyboardEvent | React.MouseEvent) => {
        if ((e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') || !inputValue.trim()) return;
        e.preventDefault();

        const newTag = inputValue.trim();
        if (!editTags.includes(newTag)) {
            setEditTags([...editTags, newTag]);
        }
        setInputValue("");
    };

    const removeTag = (tagToRemove: string) => {
        setEditTags(editTags.filter(tag => tag !== tagToRemove));
    };

    if (isEditing) {
        return (
            <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold flex items-center gap-2">
                        <Edit2 size={14} /> Edit Tags
                    </span>
                    <button onClick={() => setIsEditing(false)} className="text-muted-foreground hover:text-foreground">
                        <X size={16} />
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                    {editTags.map((tag, i) => (
                        <div key={i} className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium flex items-center gap-1 group">
                            {toTitleCase(tag)}
                            <button onClick={() => removeTag(tag)} className="text-muted-foreground group-hover:text-red-500 transition-colors">
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={addTag}
                        placeholder="Add a tag..."
                        className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        autoFocus
                    />
                    <button onClick={addTag} className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80">
                        <Plus size={16} />
                    </button>
                    <button onClick={handleSave} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
                        <Save size={14} /> Save
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-2 mt-4 items-center group/container">
            <Tag size={16} className="text-muted-foreground mr-1" />

            {tags.length > 0 ? tags.map((tag, i) => (
                <Link
                    key={i}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                    {toTitleCase(tag)}
                </Link>
            )) : (
                <span className="text-sm text-muted-foreground italic">No tags yet</span>
            )}

            <button
                onClick={() => setIsEditing(true)}
                className="ml-2 w-6 h-6 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all opacity-0 group-hover/container:opacity-100"
                aria-label="Edit tags"
            >
                <Edit2 size={12} />
            </button>
        </div>
    );
}
