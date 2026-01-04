'use client';

import Header from '@/components/Header';
import { mockProperties } from '@/lib/api';

// Mock marketplace listings
const mockListings = [
    {
        id: 'listing-001',
        seller_id: '0x1234...abcd',
        property_id: 'prop-001',
        property_name: 'Stationsplein Apartments',
        fractions: 25,
        price_per_fraction: 2650,
        total_price: 66250,
        status: 'active',
        created_at: '2025-12-28T10:00:00Z',
    },
    {
        id: 'listing-002',
        seller_id: '0x5678...efgh',
        property_id: 'prop-002',
        property_name: 'Weerwater Residences',
        fractions: 10,
        price_per_fraction: 3800,
        total_price: 38000,
        status: 'active',
        created_at: '2025-12-30T14:30:00Z',
    },
    {
        id: 'listing-003',
        seller_id: '0x9abc...ijkl',
        property_id: 'prop-001',
        property_name: 'Stationsplein Apartments',
        fractions: 50,
        price_per_fraction: 2550,
        total_price: 127500,
        status: 'active',
        created_at: '2026-01-01T09:00:00Z',
    },
];

export default function Marketplace() {
    return (
        <>
            <Header />
            <main className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Page Header */}
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Secondary Marketplace</h1>
                            <p className="text-gray-600 dark:text-gray-300">
                                Buy and sell property fractions with verified investors
                            </p>
                        </div>
                        <button className="btn-primary flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create Listing
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid sm:grid-cols-3 gap-6 mb-8">
                        <div className="stat-card animate-fade-in">
                            <div className="stat-label mb-2">Active Listings</div>
                            <div className="stat-value">{mockListings.length}</div>
                        </div>
                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <div className="stat-label mb-2">Total Volume</div>
                            <div className="stat-value">€{mockListings.reduce((acc, l) => acc + l.total_price, 0).toLocaleString()}</div>
                        </div>
                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="stat-label mb-2">Avg. Premium</div>
                            <div className="stat-value text-green-500">+3.2%</div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="card p-4 mb-6 flex flex-wrap gap-4 items-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <select className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm">
                            <option>All Properties</option>
                            {mockProperties.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <select className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm">
                            <option>Sort: Newest</option>
                            <option>Sort: Price Low</option>
                            <option>Sort: Price High</option>
                            <option>Sort: Fractions</option>
                        </select>
                        <div className="ml-auto text-sm text-gray-500">
                            Showing {mockListings.length} listings
                        </div>
                    </div>

                    {/* Listings */}
                    <div className="space-y-4">
                        {mockListings.map((listing, index) => {
                            const property = mockProperties.find(p => p.id === listing.property_id);
                            const premium = property ? ((listing.price_per_fraction - property.price_per_fraction) / property.price_per_fraction) * 100 : 0;

                            return (
                                <div
                                    key={listing.id}
                                    className="card p-6 animate-fade-in"
                                    style={{ animationDelay: `${(index + 4) * 0.1}s` }}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                        {/* Property Info */}
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white flex-shrink-0">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{listing.property_name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Seller: <span className="font-mono">{listing.seller_id}</span>
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Listed {new Date(listing.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Listing Stats */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-8">
                                            <div className="text-center">
                                                <p className="text-xs text-gray-500 mb-1">Fractions</p>
                                                <p className="font-bold text-lg">{listing.fractions}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs text-gray-500 mb-1">Price Each</p>
                                                <p className="font-bold text-lg">€{listing.price_per_fraction.toLocaleString()}</p>
                                                {premium !== 0 && (
                                                    <p className={`text-xs ${premium > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                                                        {premium > 0 ? '+' : ''}{premium.toFixed(1)}%
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs text-gray-500 mb-1">Total</p>
                                                <p className="font-bold text-lg">€{listing.total_price.toLocaleString()}</p>
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <button className="btn-primary text-sm py-2 px-6">
                                                    Buy
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Empty State (hidden for now) */}
                    {mockListings.length === 0 && (
                        <div className="card p-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No Listings Available</h3>
                            <p className="text-gray-500 mb-6">Be the first to list your property fractions for sale</p>
                            <button className="btn-primary">Create Listing</button>
                        </div>
                    )}

                    {/* Info Section */}
                    <div className="mt-12 card p-6 animate-fade-in" style={{ animationDelay: '0.7s' }}>
                        <h2 className="text-xl font-bold mb-4">How the Marketplace Works</h2>
                        <div className="grid sm:grid-cols-3 gap-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                    <span className="font-bold text-blue-500">1</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">List Your Fractions</h3>
                                    <p className="text-sm text-gray-500">Set your price and quantity to create a sell order</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                    <span className="font-bold text-blue-500">2</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">KYC Verification</h3>
                                    <p className="text-sm text-gray-500">Both parties must be Wwft-verified to trade</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                    <span className="font-bold text-blue-500">3</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Secure Transfer</h3>
                                    <p className="text-sm text-gray-500">Smart contract handles token transfer automatically</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
