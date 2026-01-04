'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import { mockProperties } from '@/lib/api';

export default function Properties() {
    return (
        <>
            <Header />
            <main className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Investment Properties</h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Browse verified Almere properties with complete Property Passports
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="card p-4 mb-8 flex flex-wrap gap-4 items-center animate-fade-in">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search properties..."
                                className="bg-transparent border-none outline-none text-sm"
                            />
                        </div>
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
                        <select className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm">
                            <option>All Cities</option>
                            <option>Almere</option>
                        </select>
                        <select className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm">
                            <option>Any Yield</option>
                            <option>5%+</option>
                            <option>7%+</option>
                            <option>10%+</option>
                        </select>
                        <select className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm">
                            <option>Any Price</option>
                            <option>Under €1,000</option>
                            <option>Under €2,500</option>
                            <option>Under €5,000</option>
                        </select>
                    </div>

                    {/* Properties Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockProperties.map((property, index) => (
                            <Link
                                key={property.id}
                                href={`/properties/${property.id}`}
                                className="card overflow-hidden animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Property Image */}
                                <div className="aspect-video bg-gradient-to-br from-blue-500 to-cyan-400 relative">
                                    <div className="absolute inset-0 flex items-center justify-center text-white">
                                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className="badge badge-info">
                                            {property.passport?.energy_label || 'A'}
                                        </span>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="badge badge-success">
                                            {property.expected_yield}% Yield
                                        </span>
                                    </div>
                                </div>

                                {/* Property Info */}
                                <div className="p-6">
                                    <h3 className="text-lg font-bold mb-2">{property.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {property.address}, {property.city}
                                    </p>

                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Price per Fraction</p>
                                            <p className="text-lg font-bold">€{property.price_per_fraction.toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">Total Value</p>
                                            <p className="text-lg font-bold">€{property.asking_price.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-500">Available</span>
                                            <span className="font-medium">
                                                {property.available_fractions} / {property.total_fractions}
                                            </span>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width: `${((property.total_fractions - property.available_fractions) / property.total_fractions) * 100}%`
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <div>
                                            <p className="text-xs text-gray-500">WOZ Value</p>
                                            <p className="font-semibold text-sm">€{((property.passport?.woz_value || 0) / 1000).toFixed(0)}k</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Built</p>
                                            <p className="font-semibold text-sm">{property.passport?.building_year || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Size</p>
                                            <p className="font-semibold text-sm">{property.passport?.floor_area || 0}m²</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}
