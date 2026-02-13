"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { GifData, GiphyService } from './giphy';
import { db } from './firebase';
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    doc,
    updateDoc,
    increment,
    setDoc,
    getDoc
} from 'firebase/firestore';

export type AddedGif = {
    id: string; // Giphy ID
    addedAt: number;
    customTags: string[];
    likes: number; // Global likes from Firestore
};

type UserState = {
    addedGifs: AddedGif[];
    likedGifIds: string[]; // Local user's liked GIFs (kept in localStorage)
    reportedGifIds: string[]; // Local user's reported GIFs (kept in localStorage)
};

type UserContextType = {
    state: UserState;
    addGif: (giphyId: string, tags: string[]) => Promise<void>;
    toggleLike: (giphyId: string) => Promise<void>;
    reportGif: (giphyId: string) => Promise<void>;
    updateTags: (giphyId: string, newTags: string[]) => Promise<void>;
    isLiked: (giphyId: string) => boolean;
    userGifsDetails: GifData[];
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_USER_PREFS = 'instagif_user_prefs';

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<UserState>({
        addedGifs: [],
        likedGifIds: [],
        reportedGifIds: [],
    });
    const [userGifsDetails, setUserGifsDetails] = useState<GifData[]>([]);

    // 1. Load local user preferences (liked/reported IDs) from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY_USER_PREFS);
        if (stored) {
            const parsed = JSON.parse(stored);
            setState(prev => ({
                ...prev,
                likedGifIds: parsed.likedGifIds || [],
                reportedGifIds: parsed.reportedGifIds || [],
            }));
        }
    }, []);

    // 2. Save local user preferences to localStorage whenever they change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const prefs = {
                likedGifIds: state.likedGifIds,
                reportedGifIds: state.reportedGifIds
            };
            localStorage.setItem(LOCAL_STORAGE_KEY_USER_PREFS, JSON.stringify(prefs));
        }
    }, [state.likedGifIds, state.reportedGifIds]);

    // 3. Subscribe to "community_gifs" collection in Firestore
    useEffect(() => {
        const q = query(collection(db, "community_gifs"), orderBy("addedAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const gifs: AddedGif[] = [];
            snapshot.forEach((doc) => {
                gifs.push(doc.data() as AddedGif);
            });
            setState(prev => ({ ...prev, addedGifs: gifs }));
        }, (error) => {
            console.error("Firestore connection failed. If you have an Ad Blocker, please disable it for this site.", error);
            alert("Unable to connect to Community Picks. Please disable your Ad Blocker or Privacy Shield.");
        });

        return () => unsubscribe();
    }, []);

    // 4. Fetch details for added GIFs from Giphy API
    useEffect(() => {
        const fetchAddedGifs = async () => {
            if (state.addedGifs.length === 0) {
                setUserGifsDetails([]);
                return;
            }
            // Only fetch details for GIFs we don't have or update if needed. 
            // For simplicity, we fetch all for now, but in prod we'd batch/cache better.
            const ids = state.addedGifs.map(g => g.id);
            // Giphy API might have a limit on IDs, usually 50 is safe.
            const uniqueIds = Array.from(new Set(ids)).slice(0, 50);

            if (uniqueIds.length === 0) return;

            const res = await GiphyService.getByIds(uniqueIds);
            if (res && res.data) {
                // Merge Firestore data (likes) with Giphy data
                const details = res.data.map((gif: any) => {
                    const firestoreData = state.addedGifs.find(g => g.id === gif.id);
                    return {
                        ...gif,
                        // We can attach the like count here if we want to display it
                        communityLikes: firestoreData?.likes || 0
                    };
                });
                setUserGifsDetails(details);
            }
        };
        fetchAddedGifs();
    }, [state.addedGifs]);

    const addGif = async (giphyId: string, tags: string[]) => {
        // Check if already exists in Firestore to avoid duplicates or overwrite
        const docRef = doc(db, "community_gifs", giphyId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            await setDoc(docRef, {
                id: giphyId,
                addedAt: Date.now(),
                customTags: tags,
                likes: 0
            });
        } else {
            // Optional: Update tags or timestamp if re-added? 
            // For now, let's just ignore if it's already there to prevent spam.
            console.log("GIF already in community picks");
        }
    };

    const toggleLike = async (giphyId: string) => {
        const isLiked = state.likedGifIds.includes(giphyId);

        // 1. Update Local State & Storage
        setState(prev => ({
            ...prev,
            likedGifIds: isLiked
                ? prev.likedGifIds.filter(id => id !== giphyId)
                : [...prev.likedGifIds, giphyId]
        }));

        // 2. Update Firestore Global Count
        const docRef = doc(db, "community_gifs", giphyId);
        try {
            await updateDoc(docRef, {
                likes: increment(isLiked ? -1 : 1)
            });
        } catch (error) {
            console.error("Error updating likes in Firestore:", error);
            // Optionally revert local state if failed
        }
    };

    const reportGif = async (giphyId: string) => {
        // 1. Update Local State
        setState(prev => {
            if (prev.reportedGifIds.includes(giphyId)) return prev;
            return { ...prev, reportedGifIds: [...prev.reportedGifIds, giphyId] };
        });

        // 2. Optional: Log report to Firestore
        // For now, we just track locally that *this user* reported it so they don't see it?
        // Or we could have a 'reports' collection. 
        // Let's increment a report count on the GIF document for moderation.
        const docRef = doc(db, "community_gifs", giphyId);
        try {
            await updateDoc(docRef, {
                reports: increment(1)
            });
        } catch (e) {
            // If the field doesn't exist or doc doesn't exist, we might need to handle it.
            // But 'community_gifs' docs are created on 'add'.
        }
    };

    const updateTags = async (giphyId: string, newTags: string[]) => {
        const docRef = doc(db, "community_gifs", giphyId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await updateDoc(docRef, {
                customTags: newTags
            });
        } else {
            // If it doesn't exist (e.g. from trending), create it so we can attach tags
            await setDoc(docRef, {
                id: giphyId,
                addedAt: Date.now(),
                customTags: newTags,
                likes: 0
            });
        }
    };

    const isLiked = (giphyId: string) => state.likedGifIds.includes(giphyId);

    return (
        <UserContext.Provider value={{ state, addGif, toggleLike, reportGif, updateTags, isLiked, userGifsDetails }}>
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
