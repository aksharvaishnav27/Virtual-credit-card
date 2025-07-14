import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <svg
                className="h-8 w-8 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                Virtual Card Generator
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Generate Virtual Credit Cards on Demand
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Create secure, customizable virtual credit cards with spending
                limits and merchant locks for safer online transactions.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/auth/register"
                  className="bg-white text-indigo-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white text-center"
                >
                  Get Started
                </Link>
                <Link
                  href="#features"
                  className="bg-transparent border border-white text-white hover:bg-white hover:bg-opacity-10 font-medium py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-lg transform rotate-6 opacity-30"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden p-6">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <p className="text-sm opacity-80">Virtual Card</p>
                        <p className="text-lg font-semibold mt-1">
                          Premium Card
                        </p>
                      </div>
                      <svg
                        className="h-8 w-8"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm opacity-80 mb-1">Card Number</p>
                      <p className="text-lg font-mono">•••• •••• •••• 4242</p>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm opacity-80 mb-1">Expiry Date</p>
                        <p className="font-mono">12/25</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-80 mb-1">CVV</p>
                        <p className="font-mono">•••</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">
                        Spending Limit
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        $500.00
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">
                        Merchant Lock
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Amazon
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">
                        Status
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our virtual credit cards provide enhanced security and control for
              all your online transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 shadow-md">
              <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Secure Transactions
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Generate unique card numbers for each merchant to keep your real
                card details private and secure.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 shadow-md">
              <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Spending Controls
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Set custom spending limits for each virtual card to manage your
                budget and prevent overcharges.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 shadow-md">
              <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Merchant Locks
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Lock virtual cards to specific merchants to prevent unauthorized
                use at other websites or services.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 shadow-md">
              <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Transaction History
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track all your virtual card transactions in one place with
                detailed merchant and spending information.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 shadow-md">
              <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Expiration Control
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Set custom expiration dates for your virtual cards to
                automatically disable them after a certain period.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 shadow-md">
              <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Instant Activation
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Activate or deactivate your virtual cards instantly with a
                single click for complete control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Get started with virtual credit cards in just a few simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Create an Account
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sign up for a free account to access our virtual card generation
                platform.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Generate Virtual Cards
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create virtual cards with custom spending limits, expiration
                dates, and merchant locks.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Use Securely Online
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Use your virtual cards for online purchases with enhanced
                security and spending control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Create your first virtual credit card today and experience safer
            online shopping.
          </p>
          <Link
            href="/auth/register"
            className="bg-white text-indigo-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white inline-block"
          >
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <svg
                  className="h-8 w-8 text-indigo-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <span className="ml-2 text-xl font-bold text-white">
                  Virtual Card Generator
                </span>
              </div>
              <p className="text-gray-400">
                Secure, customizable virtual credit cards for safer online
                transactions.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Features
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-indigo-400">
                    Virtual Cards
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-400">
                    Spending Controls
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-400">
                    Merchant Locks
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-400">
                    Transaction History
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-indigo-400">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-400">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-400">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-400">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Get Started
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/auth/signin" className="hover:text-indigo-400">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="hover:text-indigo-400">
                    Register
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-400">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-400">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Virtual Card Generator. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
