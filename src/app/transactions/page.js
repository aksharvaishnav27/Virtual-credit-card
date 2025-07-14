"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardHeader from "@/components/DashboardHeader";
import { formatCurrency, formatDate } from "@/utils/formatters";

export default function Transactions() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [transactions, setTransactions] = useState([]);
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    cardId: "",
    status: "",
    dateRange: "all", // 'all', 'today', 'week', 'month'
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Fetch transactions and cards
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch transactions
        const transactionsResponse = await fetch("/api/transactions");
        if (!transactionsResponse.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const transactionsData = await transactionsResponse.json();

        // Fetch cards for filtering
        const cardsResponse = await fetch("/api/cards");
        if (!cardsResponse.ok) {
          throw new Error("Failed to fetch cards");
        }
        const cardsData = await cardsResponse.json();

        setTransactions(transactionsData);
        setCards(cardsData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Apply filters to transactions
  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by card
    if (filters.cardId && transaction.cardId !== filters.cardId) {
      return false;
    }

    // Filter by status
    if (filters.status && transaction.status !== filters.status) {
      return false;
    }

    // Filter by date range
    if (filters.dateRange !== "all") {
      const transactionDate = new Date(transaction.createdAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (filters.dateRange === "today") {
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        if (transactionDate < today || transactionDate > endOfDay) {
          return false;
        }
      } else if (filters.dateRange === "week") {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
        if (transactionDate < startOfWeek) {
          return false;
        }
      } else if (filters.dateRange === "month") {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        if (transactionDate < startOfMonth) {
          return false;
        }
      }
    }

    return true;
  });

  // Calculate statistics
  const stats = {
    total: filteredTransactions.length,
    successful: filteredTransactions.filter((t) => t.status === "success")
      .length,
    failed: filteredTransactions.filter((t) => t.status === "failed").length,
    totalAmount: filteredTransactions
      .filter((t) => t.status === "success")
      .reduce((sum, t) => sum + t.amount, 0),
  };

  if (status === "loading" || (status === "authenticated" && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader username={session.user.name || session.user.email} />

        <main className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Transaction History
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Transactions
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.total}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Successful
              </p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {stats.successful}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Failed
              </p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                {stats.failed}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Amount
              </p>
              <p className="text-2xl font-bold text-indigo-600 mt-2">
                {formatCurrency(stats.totalAmount)}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Filters
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="cardId"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Card
                </label>
                <select
                  id="cardId"
                  name="cardId"
                  value={filters.cardId}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Cards</option>
                  {cards.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.name ||
                        `Card ending in ${card.cardNumber.slice(-4)}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Statuses</option>
                  <option value="success">Successful</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="dateRange"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Date Range
                </label>
                <select
                  id="dateRange"
                  name="dateRange"
                  value={filters.dateRange}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {transactions.length === 0
                    ? "No transactions found"
                    : "No transactions match the selected filters"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Card
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Merchant
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredTransactions.map((transaction) => {
                      const card =
                        cards.find((c) => c.id === transaction.cardId) || {};
                      return (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {formatDate(transaction.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {card.name ||
                              `Card ending in ${
                                card.cardNumber?.slice(-4) || "Unknown"
                              }`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {transaction.merchantName}
                            {transaction.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {transaction.description}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {formatCurrency(transaction.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                transaction.status === "success"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {transaction.status === "success"
                                ? "Success"
                                : "Failed"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            <Link
                              href={`/cards/${transaction.cardId}`}
                              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              View Card
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return null;
}
