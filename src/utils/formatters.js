/**
 * Format a credit card number with proper spacing and masking
 * @param {string} cardNumber - The full card number
 * @returns {string} - Formatted card number with only last 4 digits visible
 */
export const formatCardNumber = (cardNumber) => {
  if (!cardNumber) return "";

  // Keep only the last 4 digits visible, mask the rest
  const lastFourDigits = cardNumber.slice(-4);
  const maskedPart = cardNumber.slice(0, -4).replace(/\d/g, "•");

  // Format with spaces every 4 characters for readability
  const formatted =
    (maskedPart + lastFourDigits).match(/.{1,4}/g)?.join(" ") || "";

  return formatted;
};

/**
 * Format an expiry date from ISO string to MM/YY format
 * @param {string} expiryDate - ISO date string
 * @returns {string} - Formatted expiry date in MM/YY format
 */
export const formatExpiryDate = (expiryDate) => {
  if (!expiryDate) return "";

  const date = new Date(expiryDate);
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of year

  return `${month}/${year}`;
};

/**
 * Format a currency amount
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} - Formatted currency amount
 */
export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date to a readable string
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
