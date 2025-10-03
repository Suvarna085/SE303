const express = require("express");
const router = express.Router();
const {
  getAvailableExams,
  startExam,
  submitAnswer,
  submitExam,
  getMyResults,
  getExamResult,
} = require("../controllers/studentController");
const { authenticate, isStudent } = require("../middleware/auth");

// All routes require authentication and student role
router.use(authenticate, isStudent);

// Get all published exams
router.get("/exams", getAvailableExams);

// Start an exam attempt
router.post("/exams/:examId/start", startExam);

// Submit answer for a question
router.post("/answers", submitAnswer);

// Submit entire exam
router.post("/attempts/:attemptId/submit", submitExam);

// Get all my results
router.get("/results", getMyResults);

// Get result for specific exam
router.get("/exams/:examId/result", getExamResult);

module.exports = router;
