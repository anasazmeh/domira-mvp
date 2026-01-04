'use client';

import { use } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { mockProperties } from '@/lib/api';

export default function PropertyDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const property = mockProperties.find(p => p.id === id) || mockProperties[0];
    const passport = property.passport;

    return (
        <>
            <Header />
            <main className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Breadcrumb */}
                    <nav className="mb-6 text-sm">
                        <ol className="flex items-center gap-2">
                            <li><Link href="/properties" className="text-blue-500 hover:underline">Properties</Link></li>
                            <li className="text-gray-400">/</li>
                            <li className="text-gray-500">{property.name}</li>
                        </ol>
                    </nav>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Hero Image */}
                            <div className="card overflow-hidden animate-fade-in">
                                <div className="aspect-video bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white">
                                    <div className="text-center">
                                        <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <p className="text-lg opacity-80">{property.name}</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h1 className="text-2xl font-bold mb-2">{property.name}</h1>
                                            <p className="text-gray-500 flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {property.address}, {passport?.postal_code} {property.city}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="badge badge-info">{passport?.energy_label}</span>
                                            <span className="badge badge-success">{property.expected_yield}% Yield</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">{property.description}</p>
                                </div>
                            </div>

                            {/* Property Passport */}
                            <div className="card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Property Passport</h2>
                                        <p className="text-sm text-gray-500">Verified Dutch registry data</p>
                                    </div>
                                </div>

                                {passport && (
                                    <div className="space-y-6">
                                        {/* Kadaster Data */}
                                        <div>
                                            <h3 className="font-semibold text-sm text-gray-500 mb-3 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                                KADASTER (Land Registry)
                                            </h3>
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                                    <p className="text-xs text-gray-500 mb-1">Cadastral Number</p>
                                                    <p className="font-mono font-medium">{passport.cadastral_number}</p>
                                                </div>
                                                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                                    <p className="text-xs text-gray-500 mb-1">Ownership Status</p>
                                                    <p className="font-medium">{passport.ownership_status}</p>
                                                </div>
                                                {passport.mortgage_info && (
                                                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 sm:col-span-2">
                                                        <p className="text-xs text-gray-500 mb-1">Mortgage</p>
                                                        <p className="font-medium">{passport.mortgage_info}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* BAG Data */}
                                        <div>
                                            <h3 className="font-semibold text-sm text-gray-500 mb-3 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                                BAG (Building Registry)
                                            </h3>
                                            <div className="grid sm:grid-cols-3 gap-4">
                                                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                                    <p className="text-xs text-gray-500 mb-1">Building Year</p>
                                                    <p className="font-medium">{passport.building_year}</p>
                                                </div>
                                                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                                    <p className="text-xs text-gray-500 mb-1">Floor Area</p>
                                                    <p className="font-medium">{passport.floor_area} m²</p>
                                                </div>
                                                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                                    <p className="text-xs text-gray-500 mb-1">Building Type</p>
                                                    <p className="font-medium capitalize">{passport.building_type}</p>
                                                </div>
                                                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 sm:col-span-3">
                                                    <p className="text-xs text-gray-500 mb-1">Usage Purpose</p>
                                                    <p className="font-medium capitalize">{passport.usage_purpose}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* PDOK Data */}
                                        <div>
                                            <h3 className="font-semibold text-sm text-gray-500 mb-3 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                                PDOK (Energy & Valuation)
                                            </h3>
                                            <div className="grid sm:grid-cols-3 gap-4">
                                                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                                    <p className="text-xs text-gray-500 mb-1">Energy Label</p>
                                                    <p className="text-2xl font-bold text-green-500">{passport.energy_label}</p>
                                                </div>
                                                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                                    <p className="text-xs text-gray-500 mb-1">WOZ Value ({passport.woz_year})</p>
                                                    <p className="font-medium">€{passport.woz_value.toLocaleString()}</p>
                                                </div>
                                                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                                    <p className="text-xs text-gray-500 mb-1">Value per m²</p>
                                                    <p className="font-medium">€{Math.round(passport.woz_value / passport.floor_area).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar - Investment Card */}
                        <div className="space-y-6">
                            <div className="card p-6 sticky top-28 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                <h2 className="text-xl font-bold mb-6">Invest Now</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Price per Fraction</span>
                                        <span className="font-bold">€{property.price_per_fraction.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Total Property Value</span>
                                        <span className="font-medium">€{property.asking_price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Expected Annual Yield</span>
                                        <span className="font-bold text-green-500">{property.expected_yield}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Total Fractions</span>
                                        <span className="font-medium">{property.total_fractions.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-500">Available</span>
                                        <span className="font-medium">{property.available_fractions} fractions</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${((property.total_fractions - property.available_fractions) / property.total_fractions) * 100}%`
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {Math.round(((property.total_fractions - property.available_fractions) / property.total_fractions) * 100)}% funded
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Number of Fractions</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max={Math.min(property.available_fractions, Math.floor(property.total_fractions * 0.2))}
                                            defaultValue="1"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Max: {Math.floor(property.total_fractions * 0.2)} (20% cap)
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-gray-600 dark:text-gray-300">Total Investment</span>
                                            <span className="text-lg font-bold">€{property.price_per_fraction.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs text-gray-500">Est. Monthly Yield</span>
                                            <span className="text-sm font-medium text-green-500">
                                                €{((property.price_per_fraction * property.expected_yield / 100) / 12).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <button className="btn-primary w-full">
                                        Invest Now
                                    </button>

                                    <p className="text-xs text-center text-gray-500">
                                        By investing, you agree to our terms and conditions
                                    </p>
                                </div>
                            </div>

                            {/* Manager Info */}
                            <div className="card p-6">
                                <h3 className="font-semibold mb-4">Property Manager</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
                                        D
                                    </div>
                                    <div>
                                        <p className="font-medium">Domira Property Management</p>
                                        <p className="text-xs text-gray-500 font-mono truncate max-w-[200px]">
                                            {property.manager_address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
