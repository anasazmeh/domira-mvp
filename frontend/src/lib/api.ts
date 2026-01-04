// API client for Domira backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface User {
    id: string;
    email: string;
    full_name: string;
    wallet_address: string | null;
    kyc_status: 'pending' | 'verified' | 'failed' | 'expired';
    created_at: string;
    updated_at: string;
}

export interface PropertyPassport {
    cadastral_number: string;
    ownership_status: string;
    mortgage_info: string | null;
    address: string;
    postal_code: string;
    city: string;
    building_year: number;
    floor_area: number;
    building_type: string;
    usage_purpose: string;
    energy_label: string;
    woz_value: number;
    woz_year: number;
}

export interface Property {
    id: string;
    name: string;
    description: string;
    address: string;
    city: string;
    asking_price: number;
    total_fractions: number;
    available_fractions: number;
    price_per_fraction: number;
    expected_yield: number;
    token_id: number | null;
    passport: PropertyPassport | null;
    manager_address: string;
    created_at: string;
}

export interface Listing {
    id: string;
    seller_id: string;
    property_id: string;
    property_name: string;
    fractions: number;
    price_per_fraction: number;
    total_price: number;
    status: 'active' | 'sold' | 'cancelled';
    created_at: string;
}

export interface PortfolioHolding {
    property_id: string;
    property_name: string;
    token_id: number;
    fractions_held: number;
    total_fractions: number;
    percentage_held: number;
    current_value: number;
    monthly_yield: number;
}

export interface Portfolio {
    user_id: string;
    total_value: number;
    monthly_yield: number;
    holdings: PortfolioHolding[];
    diversification_warning: string | null;
}

// API functions
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return response.json();
}

// Users API
export const usersApi = {
    create: (data: { email: string; full_name: string; wallet_address?: string }) =>
        fetchApi<User>('/users', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    get: (userId: string) => fetchApi<User>(`/users/${userId}`),

    getKycStatus: (userId: string) =>
        fetchApi<{ user_id: string; kyc_status: string; wallet_whitelisted: boolean }>(
            `/users/${userId}/kyc-status`
        ),
};

// Properties API
export const propertiesApi = {
    list: (filters?: { city?: string; min_price?: number; max_price?: number }) => {
        const params = new URLSearchParams();
        if (filters?.city) params.set('city', filters.city);
        if (filters?.min_price) params.set('min_price', filters.min_price.toString());
        if (filters?.max_price) params.set('max_price', filters.max_price.toString());
        const query = params.toString() ? `?${params.toString()}` : '';
        return fetchApi<Property[]>(`/properties${query}`);
    },

    get: (propertyId: string) => fetchApi<Property>(`/properties/${propertyId}`),

    getPassport: (propertyId: string) =>
        fetchApi<PropertyPassport>(`/properties/${propertyId}/passport`),

    create: (data: Omit<Property, 'id' | 'token_id' | 'passport' | 'available_fractions' | 'manager_address' | 'created_at'>) =>
        fetchApi<Property>('/properties', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};

// Marketplace API
export const marketplaceApi = {
    listListings: (filters?: { property_id?: string; max_price?: number }) => {
        const params = new URLSearchParams();
        if (filters?.property_id) params.set('property_id', filters.property_id);
        if (filters?.max_price) params.set('max_price', filters.max_price.toString());
        const query = params.toString() ? `?${params.toString()}` : '';
        return fetchApi<Listing[]>(`/marketplace/listings${query}`);
    },

    getListing: (listingId: string) => fetchApi<Listing>(`/marketplace/listings/${listingId}`),

    createListing: (data: { property_id: string; fractions: number; price_per_fraction: number }) =>
        fetchApi<Listing>('/marketplace/listings', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    buy: (data: { listing_id: string; fractions: number }) =>
        fetchApi<{ message: string; fractions_bought: number; total_cost: number }>(
            '/marketplace/buy',
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        ),
};

// KYC API
export const kycApi = {
    createSession: (userId: string, walletAddress: string) =>
        fetchApi<{ session_id: string; url: string; status: string }>(
            `/webhooks/create-verification-session?user_id=${userId}&wallet_address=${walletAddress}`,
            { method: 'POST' }
        ),
};

// Mock data for development
export const mockPortfolio: Portfolio = {
    user_id: 'demo-user',
    total_value: 47500,
    monthly_yield: 312.50,
    holdings: [
        {
            property_id: 'prop-001',
            property_name: 'Stationsplein Apartments',
            token_id: 0,
            fractions_held: 150,
            total_fractions: 1000,
            percentage_held: 15,
            current_value: 22500,
            monthly_yield: 156.25,
        },
        {
            property_id: 'prop-002',
            property_name: 'Weerwater Residences',
            token_id: 1,
            fractions_held: 100,
            total_fractions: 500,
            percentage_held: 20,
            current_value: 25000,
            monthly_yield: 156.25,
        },
    ],
    diversification_warning: 'You are at the 20% maximum holding for Weerwater Residences',
};

export const mockProperties: Property[] = [
    {
        id: 'prop-001',
        name: 'Stationsplein Apartments',
        description: 'Modern apartment complex near Almere Centrum station with excellent rental demand.',
        address: 'Stationsplein 45',
        city: 'Almere',
        asking_price: 2500000,
        total_fractions: 1000,
        available_fractions: 650,
        price_per_fraction: 2500,
        expected_yield: 7.5,
        token_id: 0,
        passport: {
            cadastral_number: 'ALM-A-4521',
            ownership_status: 'Eigendom',
            mortgage_info: 'ABN AMRO Bank N.V.',
            address: 'Stationsplein 45',
            postal_code: '1315 NT',
            city: 'Almere',
            building_year: 2019,
            floor_area: 125.5,
            building_type: 'apartment',
            usage_purpose: 'residential',
            energy_label: 'A+',
            woz_value: 485000,
            woz_year: 2025,
        },
        manager_address: '0x1234567890abcdef1234567890abcdef12345678',
        created_at: '2025-12-01T10:00:00Z',
    },
    {
        id: 'prop-002',
        name: 'Weerwater Residences',
        description: 'Waterfront luxury apartments with stunning views of Lake Weerwater.',
        address: 'Weerwater 12',
        city: 'Almere',
        asking_price: 1800000,
        total_fractions: 500,
        available_fractions: 200,
        price_per_fraction: 3600,
        expected_yield: 6.8,
        token_id: 1,
        passport: {
            cadastral_number: 'ALM-B-2847',
            ownership_status: 'Eigendom',
            mortgage_info: null,
            address: 'Weerwater 12',
            postal_code: '1316 AB',
            city: 'Almere',
            building_year: 2022,
            floor_area: 98.2,
            building_type: 'apartment',
            usage_purpose: 'residential',
            energy_label: 'A++',
            woz_value: 520000,
            woz_year: 2025,
        },
        manager_address: '0xabcdef1234567890abcdef1234567890abcdef12',
        created_at: '2025-12-15T14:30:00Z',
    },
];
