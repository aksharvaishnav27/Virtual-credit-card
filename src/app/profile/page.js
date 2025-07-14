"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Profile() {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!session) return;
      setLoadingTx(true);
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        setTransactions(data.slice(0, 5)); // Show last 5
      } catch (e) {
        setTransactions([]);
      } finally {
        setLoadingTx(false);
      }
    };
    fetchTransactions();
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Not signed in
          </h1>
          <p className="text-gray-700 mb-6">
            Please sign in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  const { user } = session;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center mb-6">
          {user.image ? (
            <img
              src={user.image}
              alt="Profile"
              className="w-20 h-20 rounded-full mb-3 object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3 text-3xl text-gray-500">
              {user.name ? user.name[0] : user.email[0]}
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {user.name || "-"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          {loadingTx ? (
            <div className="text-gray-500 dark:text-gray-400">
              Loading transactions...
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400">
              No recent transactions.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((tx) => (
                <li key={tx.id} className="py-2 flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-200">
                      {new Date(tx.createdAt).toLocaleString()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        tx.status === "success"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tx.status === "success" ? "Success" : "Failed"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-900 dark:text-white font-medium">
                      {tx.merchantName}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      ${tx.amount.toFixed(2)}
                    </span>
                  </div>
                  {tx.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {tx.description}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
