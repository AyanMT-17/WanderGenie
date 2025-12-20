// TypeScript interfaces for API responses
export interface User {
    id: string;
    email: string;
    name: string;
    created_at: string;
}

export interface Token {
    access_token: string;
    token_type: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    name: string;
    password: string;
}

export interface TravelStyle {
    value: "adventure" | "relaxation" | "cultural" | "luxury" | "budget" | "family";
    label: string;
}

export interface PlanRequest {
    destination: string;
    days: number;
    budget: number;
    travel_style: string;
}

export interface Attraction {
    name: string;
    description: string;
    duration: string;
    estimated_cost: number;
}

export interface DayItinerary {
    day: number;
    title: string;
    morning: Attraction[];
    afternoon: Attraction[];
    evening: Attraction[];
    accommodation: string;
    daily_budget: number;
}

export interface TransportInfo {
    type: string;
    details: string;
    estimated_cost: number;
}

export interface Itinerary {
    destination: string;
    total_days: number;
    total_budget: number;
    travel_style: string;
    days: DayItinerary[];
    transport: TransportInfo[];
    tips: string[];
}

export interface ItineraryHistoryItem {
    id: string;
    destination: string;
    total_days: number;
    total_budget: number;
    travel_style: string;
    created_at: string;
    itinerary: Itinerary;
}
