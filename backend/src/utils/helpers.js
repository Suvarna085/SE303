const crypto = require("crypto");

// Generate random token for email verification
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Generate device fingerprint from request
const generateDeviceFingerprint = (req) => {
  const userAgent = req.headers["user-agent"] || "";
  const ip = req.ip || req.connection.remoteAddress || "";
  return crypto
    .createHash("sha256")
    .update(userAgent + ip)
    .digest("hex");
};

// Shuffle array (Fisher-Yates algorithm) for question randomization
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Calculate percentage
const calculatePercentage = (scored, total) => {
  if (total === 0) return 0;
  return ((scored / total) * 100).toFixed(2);
};

// Format date to readable string
const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

module.exports = {
  generateVerificationToken,
  generateDeviceFingerprint,
  shuffleArray,
  calculatePercentage,
  formatDate,
};
