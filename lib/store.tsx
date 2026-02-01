"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { GifData, GiphyService } from './giphy';

export type AddedGif = {
    id: string; // Giphy ID
    addedAt: number;
    customTags: string[];
    likes: number; // Simulated additional likes
};

type UserState = {
    addedGifs: AddedGif[];
    likedGifIds: string[];
    reportedGifIds: string[];
};

type UserContextType = {
    state: UserState;
    addGif: (giphyId: string, tags: string[]) => void;
    toggleLike: (giphyId: string) => void;
    reportGif: (giphyId: string) => void;
    isLiked: (giphyId: string) => boolean;
    userGifsDetails: GifData[];
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'instagif_user_data';

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<UserState>({
        addedGifs: [],
        likedGifIds: [],
        reportedGifIds: [],
    });
    const [userGifsDetails, setUserGifsDetails] = useState<GifData[]>([]);

    // Load from local storage
    useEffect(() => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
            setState(JSON.parse(stored));
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
        }
    }, [state]);

    // Fetch details for added GIFs
    useEffect(() => {
        const fetchAddedGifs = async () => {
            if (state.addedGifs.length === 0) {
                setUserGifsDetails([]);
                return;
            }
            const ids = state.addedGifs.map(g => g.id);
            const res = await GiphyService.getByIds(ids);
            if (res && res.data) {
                setUserGifsDetails(res.data);
            }
        };
        fetchAddedGifs();
    }, [state.addedGifs]);

    const addGif = (giphyId: string, tags: string[]) => {
        setState(prev => {
            if (prev.addedGifs.find(g => g.id === giphyId)) return prev;
            return {
                ...prev,
                addedGifs: [{ id: giphyId, addedAt: Date.now(), customTags: tags, likes: 0 }, ...prev.addedGifs]
            };
        });
    };

    const toggleLike = (giphyId: string) => {
        setState(prev => {
            const isLiked = prev.likedGifIds.includes(giphyId);
            return {
                ...prev,
                likedGifIds: isLiked
                    ? prev.likedGifIds.filter(id => id !== giphyId)
                    : [...prev.likedGifIds, giphyId]
            };
        });
    };

    const reportGif = (giphyId: string) => {
        setState(prev => {
            if (prev.reportedGifIds.includes(giphyId)) return prev;
            return { ...prev, reportedGifIds: [...prev.reportedGifIds, giphyId] };
        });
    };

    const isLiked = (giphyId: string) => state.likedGifIds.includes(giphyId);

    return (
        <UserContext.Provider value={{ state, addGif, toggleLike, reportGif, isLiked, userGifsDetails }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserStore() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUserStore must be used within a UserProvider');
    }
    return context;
}
