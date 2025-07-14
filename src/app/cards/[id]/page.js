"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import {
  formatCardNumber,
  formatExpiryDate,
  formatCurrency,
  formatDate,
} from "@/utils/formatters";

export default function CardDetail({ params }) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [card, setCard] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    amount: "",
    merchant: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionError, setTransactionError] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Fetch card details and transactions
  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/cards/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Card not found");
          }
          throw new Error("Failed to fetch card details");
        }

        const data = await response.json();
        setCard(data.card);
        setTransactions(data.transactions || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching card details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (session && id) {
      fetchCardDetails();
    }
  }, [session, id]);

  // Handle card status toggle
  const handleToggleCardStatus = async () => {
    try {
      const response = await fetch(`/api/cards/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !card.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update card status");
      }

      // Update the card state
      setCard((prev) => ({ ...prev, isActive: !prev.isActive }));
    } catch (err) {
      console.error("Error updating card status:", err);
      setError(err.message);
    }
  };

  // Handle card deletion
  const handleDeleteCard = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this card? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/cards/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete card");
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Error deleting card:", err);
      setError(err.message);
    }
  };

  // Handle transaction form input change
  const handleTransactionInputChange = (e) => {
    const { name, value } = e.target;
    setTransactionForm((prev) => ({
      ...prev,
      [name]:
        name === "amount" ? (value === "" ? "" : parseFloat(value)) : value,
    }));
  };

  // Handle transaction submission
  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTransactionError(null);

    try {
      // Validate form
      if (!transactionForm.amount || transactionForm.amount <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      if (!transactionForm.merchant) {
        throw new Error("Merchant name is required");
      }

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardId: id,
          amount: transactionForm.amount,
          merchantName: transactionForm.merchant, // <-- fix here
          description: transactionForm.description || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process transaction");
      }

      // Reset form
      setTransactionForm({
        amount: "",
        merchant: "",
        description: "",
      });

      // Refresh card details and transactions
      const cardResponse = await fetch(`/api/cards/${id}`);
      const cardData = await cardResponse.json();
      setCard(cardData.card);
      setTransactions(cardData.transactions || []);
    } catch (err) {
      setTransactionError(err.message);
      console.error("Error processing transaction:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if card is expired
  const isCardExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  if (status === "loading" || (status === "authenticated" && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            Loading card details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader
          username={session?.user?.name || session?.user?.email}
        />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {error ||
                "Card not found. Please check the link or return to your dashboard."}
            </p>
            <Link
              href="/dashboard"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (status === "authenticated" && card) {
    const expired = isCardExpired(card.expiryDate);
    const statusClass =
      card.isActive && !expired
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader username={session.user.name || session.user.email} />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Dashboard
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {card.name || "Virtual Card"}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}
                >
                  {card.isActive && !expired
                    ? "Active"
                    : expired
                    ? "Expired"
                    : "Inactive"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-sm opacity-80">Virtual Card</p>
                      <p className="text-lg font-semibold mt-1">
                        {card.name || "Card"}
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
                    <div className="flex items-center">
                      <p className="text-lg font-mono">
                        {showCardDetails
                          ? formatCardNumber(card.cardNumber)
                          : "•••• •••• •••• " + card.cardNumber.slice(-4)}
                      </p>
                      <button
                        onClick={() => setShowCardDetails(!showCardDetails)}
                        className="ml-2 text-white opacity-80 hover:opacity-100 focus:outline-none"
                      >
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          {showCardDetails ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm opacity-80 mb-1">Expiry Date</p>
                      <p className="font-mono">
                        {formatExpiryDate(card.expiryDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80 mb-1">CVV</p>
                      <p className="font-mono">
                        {showCardDetails ? card.cvv : "•••"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Spending Limit
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(card.spendingLimit)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Current Spent
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(card.currentSpent)}
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (card.currentSpent / card.spendingLimit) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {card.merchantLock && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Merchant Lock
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {card.merchantLock}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Created On
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {formatDate(card.createdAt)}
                    </p>
                  </div>

                  <div className="pt-4 flex space-x-3">
                    <button
                      onClick={handleToggleCardStatus}
                      disabled={expired}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        card.isActive
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          : "bg-green-100 text-green-800 hover:bg-green-200"
                      } ${expired ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {card.isActive ? "Deactivate Card" : "Activate Card"}
                    </button>

                    <button
                      onClick={handleDeleteCard}
                      className="px-4 py-2 bg-red-100 text-red-800 hover:bg-red-200 rounded-md text-sm font-medium"
                    >
                      Delete Card
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Transaction Form */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Simulate Transaction
                </h2>

                {transactionError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {transactionError}
                  </div>
                )}

                <form onSubmit={handleTransactionSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Amount ($)
                      </label>
                      <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={transactionForm.amount}
                        onChange={handleTransactionInputChange}
                        min="0.01"
                        step="0.01"
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        disabled={!card.isActive || expired || isSubmitting}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="merchant"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Merchant
                      </label>
                      <input
                        type="text"
                        id="merchant"
                        name="merchant"
                        value={transactionForm.merchant}
                        onChange={handleTransactionInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        disabled={!card.isActive || expired || isSubmitting}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Description (Optional)
                      </label>
                      <input
                        type="text"
                        id="description"
                        name="description"
                        value={transactionForm.description}
                        onChange={handleTransactionInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        disabled={!card.isActive || expired || isSubmitting}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!card.isActive || expired || isSubmitting}
                      className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Processing..." : "Process Transaction"}
                    </button>

                    {(!card.isActive || expired) && (
                      <p className="text-sm text-red-600 mt-2">
                        {expired ? "Card is expired" : "Card is inactive"}.
                        Transactions cannot be processed.
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Transaction History */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Transaction History
                </h2>

                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No transactions yet
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
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {transactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {formatDate(transaction.createdAt)}
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
