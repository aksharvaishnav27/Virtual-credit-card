"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CardList from "@/components/CardList";
import CreateCardModal from "@/components/CreateCardModal";
import DashboardHeader from "@/components/DashboardHeader";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'active', 'expired'

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Fetch cards
  const fetchCards = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cards");

      if (!response.ok) {
        throw new Error("Failed to fetch cards");
      }

      const data = await response.json();
      setCards(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching cards:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchCards();
    }
  }, [session]);

  // Handle card creation
  const handleCreateCard = async (cardData) => {
    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cardData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create card");
      }

      // Refresh the card list
      fetchCards();
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error("Error creating card:", err);
      return { error: err.message };
    }
  };

  // Handle card deletion
  const handleDeleteCard = async (cardId) => {
    if (!confirm("Are you sure you want to delete this card?")) {
      return;
    }

    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete card");
      }

      // Refresh the card list
      fetchCards();
    } catch (err) {
      console.error("Error deleting card:", err);
      setError(err.message);
    }
  };

  // Handle card deactivation
  const handleToggleCardStatus = async (cardId, isCurrentlyActive) => {
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !isCurrentlyActive,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update card status");
      }

      // Refresh the card list
      fetchCards();
    } catch (err) {
      console.error("Error updating card status:", err);
      setError(err.message);
    }
  };

  // Filter cards based on active filter
  const filteredCards = cards.filter((card) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "active") return card.isActive;
    if (activeFilter === "expired")
      return !card.isActive || new Date(card.expiryDate) < new Date();
    return true;
  });

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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Virtual Cards
            </h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create New Card
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-md ${
                activeFilter === "all"
                  ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              All Cards
            </button>
            <button
              onClick={() => setActiveFilter("active")}
              className={`px-4 py-2 rounded-md ${
                activeFilter === "active"
                  ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Active Cards
            </button>
            <button
              onClick={() => setActiveFilter("expired")}
              className={`px-4 py-2 rounded-md ${
                activeFilter === "expired"
                  ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Expired/Inactive Cards
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {filteredCards.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {cards.length === 0
                  ? "You haven't created any virtual cards yet."
                  : "No cards match the selected filter."}
              </p>
              {cards.length === 0 && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Your First Card
                </button>
              )}
            </div>
          ) : (
            <CardList
              cards={filteredCards}
              onDelete={handleDeleteCard}
              onToggleStatus={handleToggleCardStatus}
            />
          )}
        </main>

        {isCreateModalOpen && (
          <CreateCardModal
            onClose={() => setIsCreateModalOpen(false)}
            onCreate={handleCreateCard}
          />
        )}
      </div>
    );
  }

  return null;
}
