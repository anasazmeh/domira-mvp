'use client';

import Header from '@/components/Header';
import { mockPortfolio } from '@/lib/api';

export default function Dashboard() {
    const portfolio = mockPortfolio;

    return (
        <>
            <Header />
            <main className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Investor Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Track your portfolio performance and manage your investments
                        </p>
                    </div>

                    {/* Diversification Warning */}
                    {portfolio.diversification_warning && (
                        <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-3 animate-fade-in">
                            <svg className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-amber-800 dark:text-amber-200">Diversification Warning</h3>
                                <p className="text-sm text-amber-700 dark:text-amber-300">{portfolio.diversification_warning}</p>
                            </div>
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Portfolio Value */}
                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="stat-label">Portfolio Value</span>
                            </div>
                            <div className="stat-value">€{portfolio.total_value.toLocaleString()}</div>
                            <div className="text-sm text-green-500 mt-2 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                +5.2% this month
                            </div>
                        </div>

                        {/* Monthly Yield */}
                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="stat-label">Monthly Yield</span>
                            </div>
                            <div className="stat-value text-green-500">€{portfolio.monthly_yield.toFixed(2)}</div>
                            <div className="text-sm text-gray-500 mt-2">
                                Next payout: Jan 5, 2026
                            </div>
                        </div>

                        {/* Properties Owned */}
                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <span className="stat-label">Properties</span>
                            </div>
                            <div className="stat-value">{portfolio.holdings.length}</div>
                            <div className="text-sm text-gray-500 mt-2">
                                Active investments
                            </div>
                        </div>

                        {/* Total Fractions */}
                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                    </svg>
                                </div>
                                <span className="stat-label">Total Fractions</span>
                            </div>
                            <div className="stat-value">
                                {portfolio.holdings.reduce((acc, h) => acc + h.fractions_held, 0)}
                            </div>
                            <div className="text-sm text-gray-500 mt-2">
                                Across all properties
                            </div>
                        </div>
                    </div>

                    {/* Holdings Table */}
                    <div className="card p-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                        <h2 className="text-xl font-bold mb-6">Your Holdings</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">Property</th>
                                        <th className="text-right py-4 px-4 text-sm font-semibold text-gray-500">Fractions</th>
                                        <th className="text-right py-4 px-4 text-sm font-semibold text-gray-500">Ownership</th>
                                        <th className="text-right py-4 px-4 text-sm font-semibold text-gray-500">Value</th>
                                        <th className="text-right py-4 px-4 text-sm font-semibold text-gray-500">Monthly Yield</th>
                                        <th className="text-right py-4 px-4 text-sm font-semibold text-gray-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {portfolio.holdings.map((holding, index) => (
                                        <tr
                                            key={holding.property_id}
                                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                        >
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{holding.property_name}</div>
                                                        <div className="text-sm text-gray-500">Token #{holding.token_id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right font-medium">
                                                {holding.fractions_held} / {holding.total_fractions}
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${holding.percentage_held >= 20
                                                                    ? 'bg-gradient-to-r from-amber-500 to-red-500'
                                                                    : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                                                                }`}
                                                            style={{ width: `${(holding.percentage_held / 20) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className={`font-medium ${holding.percentage_held >= 20 ? 'text-amber-500' : ''}`}>
                                                        {holding.percentage_held}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right font-medium">
                                                €{holding.current_value.toLocaleString()}
                                            </td>
                                            <td className="py-4 px-4 text-right text-green-500 font-medium">
                                                €{holding.monthly_yield.toFixed(2)}
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                {holding.percentage_held >= 20 ? (
                                                    <span className="badge badge-warning">Max Cap</span>
                                                ) : (
                                                    <span className="badge badge-success">Active</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* KYC Status */}
                    <div className="mt-6 card p-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold">KYC Verification</h3>
                                    <p className="text-sm text-gray-500">Your identity has been verified</p>
                                </div>
                            </div>
                            <span className="badge badge-success">Verified</span>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
