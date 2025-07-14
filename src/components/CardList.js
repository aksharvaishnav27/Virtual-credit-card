import React from "react";
import Link from "next/link";
import { formatCardNumber, formatExpiryDate } from "@/utils/formatters";

const CardList = ({ cards, onDelete, onToggleStatus }) => {
  // Function to check if a card is expired
  const isCardExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => {
        const expired = isCardExpired(card.expiryDate);
        const statusClass =
          card.isActive && !expired
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800";

        return (
          <div
            key={card.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {card.name || "Virtual Card"}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}
                >
                  {card.isActive && !expired
                    ? "Active"
                    : expired
                    ? "Expired"
                    : "Inactive"}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Card Number:</span>{" "}
                  {formatCardNumber(card.cardNumber)}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Expiry:</span>{" "}
                  {formatExpiryDate(card.expiryDate)}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">CVV:</span>{" "}
                  {card.cvv.replace(/\d/g, "•")}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Spending Limit:</span> $
                  {card.spendingLimit.toFixed(2)}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Current Spent:</span> $
                  {card.currentSpent.toFixed(2)}
                </p>
                {card.merchantLock && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Merchant Lock:</span>{" "}
                    {card.merchantLock}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href={`/cards/${card.id}`}
                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
                >
                  View Details
                </Link>

                <div className="flex space-x-2">
                  <button
                    onClick={() => onToggleStatus(card.id, card.isActive)}
                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                      card.isActive
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                    disabled={expired}
                  >
                    {card.isActive ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    onClick={() => onDelete(card.id)}
                    className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded-md text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardList;
