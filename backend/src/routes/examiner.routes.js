const express = require("express");
const router = express.Router();
const {
  createExam,
  getExamPreview,
  publishExam,
  getMyExams,
  getExamAnalytics,
} = require("../controllers/examinerController");
const { examCreationValidation, validate } = require("../utils/validators");
const { authenticate, isExaminer } = require("../middleware/auth");

// All routes require authentication and examiner role
router.use(authenticate, isExaminer);

// Create exam with AI-generated questions
router.post("/exams", examCreationValidation, validate, createExam);

// Get all exams created by this examiner
router.get("/exams", getMyExams);

// Get exam preview with questions
router.get("/exams/:examId/preview", getExamPreview);

// Publish exam (make available to students)
router.put("/exams/:examId/publish", publishExam);

// Get exam analytics and results
router.get("/exams/:examId/analytics", getExamAnalytics);

module.exports = router;
