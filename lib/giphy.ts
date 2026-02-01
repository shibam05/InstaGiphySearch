import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY;
const BASE_URL = 'https://api.giphy.com/v1/gifs';

export type GifData = {
    id: string;
    title: string;
    images: {
        original: { url: string; width: string; height: string };
        fixed_height: { url: string; width: string; height: string };
    };
    user?: {
        username: string;
        avatar_url: string;
        display_name: string;
        is_verified?: boolean;
    };
    username?: string;
};

export const GiphyService = {
    async getTrending(limit = 20, offset = 0) {
        if (!API_KEY) return { data: [] };
        const response = await axios.get(`${BASE_URL}/trending`, {
            params: { api_key: API_KEY, limit, offset, rating: 'g' },
        });
        return response.data;
    },

    async search(query: string, limit = 20, offset = 0) {
        if (!API_KEY) return { data: [] };
        const response = await axios.get(`${BASE_URL}/search`, {
            params: { api_key: API_KEY, q: query, limit, offset, rating: 'g' },
        });
        return response.data;
    },

    async getById(id: string) {
        if (!API_KEY) return null;
        try {
            const response = await axios.get(`${BASE_URL}/${id}`, {
                params: { api_key: API_KEY },
            });
            return response.data.data;
        } catch (error) {
            console.error("Error fetching GIF by ID", error);
            return null;
        }
    },

    async getByIds(ids: string[]) {
        if (!API_KEY || ids.length === 0) return { data: [] };
        try {
            const response = await axios.get(`${BASE_URL}`, {
                params: { api_key: API_KEY, ids: ids.join(',') }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching GIFs by IDs", error);
            return { data: [] };
        }
    }
};
