import axios from 'axios';
import type { LoginCredentials, RegisterData, Token, User, PlanRequest, Itinerary } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// API functions
export const authAPI = {
    register: async (data: RegisterData): Promise<User> => {
        const response = await api.post<User>('/auth/register', data);
        return response.data;
    },

    login: async (credentials: LoginCredentials): Promise<Token> => {
        const response = await api.post<Token>('/auth/login', credentials);
        return response.data;
    },

    getMe: async (): Promise<User> => {
        const response = await api.get<User>('/auth/me');
        return response.data;
    },
};

export const planningAPI = {
    createItinerary: async (request: PlanRequest): Promise<Itinerary> => {
        const response = await api.post<Itinerary>('/plan', request);
        return response.data;
    },

    getItineraries: async (): Promise<{ count: number; itineraries: any[] }> => {
        const response = await api.get('/itineraries');
        return response.data;
    },
};

export default api;
