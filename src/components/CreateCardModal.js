import { useState } from "react";

const CreateCardModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: "",
    spendingLimit: 1000,
    merchantLock: "",
    expiryMonths: 12, // Default expiry of 12 months from now
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "spendingLimit" || name === "expiryMonths"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form data
      if (formData.spendingLimit <= 0) {
        throw new Error("Spending limit must be greater than 0");
      }

      if (formData.expiryMonths <= 0) {
        throw new Error("Expiry months must be greater than 0");
      }

      // Calculate expiry date based on months from now
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + formData.expiryMonths);

      // Prepare data for API
      const cardData = {
        spendingLimit: formData.spendingLimit,
        expiryDate: expiryDate.toISOString(),
        merchantLock: formData.merchantLock || undefined,
        name: formData.name || undefined,
      };

      const result = await onCreate(cardData);

      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Create New Virtual Card
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Card Name (Optional)
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Shopping Card, Subscription Card"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="spendingLimit"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Spending Limit ($)
                </label>
                <input
                  type="number"
                  id="spendingLimit"
                  name="spendingLimit"
                  value={formData.spendingLimit}
                  onChange={handleChange}
                  min="1"
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="merchantLock"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Merchant Lock (Optional)
                </label>
                <input
                  type="text"
                  id="merchantLock"
                  name="merchantLock"
                  value={formData.merchantLock}
                  onChange={handleChange}
                  placeholder="e.g., Amazon, Netflix"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  If set, the card can only be used with this merchant.
                </p>
              </div>

              <div>
                <label
                  htmlFor="expiryMonths"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Expiry (months from now)
                </label>
                <input
                  type="number"
                  id="expiryMonths"
                  name="expiryMonths"
                  value={formData.expiryMonths}
                  onChange={handleChange}
                  min="1"
                  max="60"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating..." : "Create Card"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCardModal;
