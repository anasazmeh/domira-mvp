import Link from 'next/link';
import Header from '@/components/Header';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900" />

          {/* Decorative circles */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="animate-fade-in">
                <span className="badge badge-info mb-6">🇳🇱 Dutch Real Estate</span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Own a Piece of{' '}
                  <span className="gradient-text">Dutch Property</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl">
                  Invest in premium Almere real estate through tokenized SPV fractions.
                  Earn monthly rental income with as little as €250.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/properties" className="btn-primary text-center">
                    Browse Properties
                  </Link>
                  <Link href="/dashboard" className="btn-secondary text-center">
                    View Dashboard
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-blue-500">€4.2M</div>
                    <div className="text-sm text-gray-500">Total Value Locked</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-green-500">7.2%</div>
                    <div className="text-sm text-gray-500">Avg. Yield</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-cyan-500">126</div>
                    <div className="text-sm text-gray-500">Investors</div>
                  </div>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="card p-6 md:p-8">
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 mb-6 flex items-center justify-center">
                    <div className="text-center text-white">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <p className="font-medium">Stationsplein Apartments</p>
                      <p className="text-sm opacity-80">Almere, Netherlands</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Price per Fraction</p>
                      <p className="text-2xl font-bold">€2,500</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Expected Yield</p>
                      <p className="text-2xl font-bold text-green-500">7.5%</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500">Sold</span>
                      <span className="font-medium">350 / 1,000 fractions</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '35%' }} />
                    </div>
                  </div>
                  <Link href="/properties/prop-001" className="btn-primary w-full text-center block">
                    View Property
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Invest with <span className="gradient-text">Domira</span>?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                We make Dutch real estate investment accessible, transparent, and secure.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="card p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Wwft Compliant</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Full KYC verification through Stripe Identity ensures regulatory compliance.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="card p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">20% Diversification Cap</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Smart contract enforced limits ensure healthy portfolio diversification.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Property Passport</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Complete transparency with verified Kadaster, BAG, and WOZ data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <span className="font-bold text-xl">D</span>
                </div>
                <span className="text-xl font-bold">Domira</span>
              </div>
              <p className="text-gray-400 text-sm">
                © 2026 Domira. Fractional Dutch Real Estate Investment.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
