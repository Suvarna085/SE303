module.exports = {
  USER_ROLES: {
    STUDENT: "student",
    EXAMINER: "examiner",
  },

  DIFFICULTY_LEVELS: {
    EASY: "easy",
    MEDIUM: "medium",
    HARD: "hard",
  },

  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours in milliseconds

  EMAIL_VERIFICATION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours

  PASSWORD_MIN_LENGTH: 8,

  EXAM_STATUSES: {
    DRAFT: "draft",
    PUBLISHED: "published",
    COMPLETED: "completed",
  },
};
