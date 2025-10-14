# Frontend Test Checklist

## Prerequisites
- Backend server running on http://localhost:5000
- Frontend server running on http://localhost:5173
- Fresh browser session (clear cache/cookies or use incognito)

---

## Test Suite 1: Authentication

### Test 1.1: Examiner Registration
- [ ] Navigate to http://localhost:5173
- [ ] Click "Register"
- [ ] Fill form:
  - Name: "John Examiner"
  - Email: "john@test.com"
  - Password: "Test1234"
  - Role: "Examiner"
- [ ] Click "Register"
- [ ] *Expected*: Success message, redirect to login
- [ ] *Result*: PASS / FAIL

### Test 1.2: Examiner Login
- [ ] Enter email: "john@test.com"
- [ ] Enter password: "Test1234"
- [ ] Click "Login"
- [ ] *Expected*: Redirect to Examiner Dashboard
- [ ] *Result*: PASS / FAIL

### Test 1.3: Student Registration
- [ ] Logout
- [ ] Register new account:
  - Name: "Alice Student"
  - Email: "alice@test.com"
  - Password: "Test1234"
  - Role: "Student"
- [ ] *Expected*: Success, redirect to login
- [ ] *Result*: PASS / FAIL

### Test 1.4: Student Login
- [ ] Login with alice@test.com / Test1234
- [ ] *Expected*: Redirect to Student Dashboard
- [ ] *Result*: PASS / FAIL

---

## Test Suite 2: Exam Creation (Examiner)

### Test 2.1: Create Exam with AI
- [ ] Login as examiner (john@test.com)
- [ ] Click "Create New Exam"
- [ ] Fill form:
  - Title: "JavaScript Quiz"
  - Topic: "JavaScript basics"
  - Difficulty: "Easy"
  - Questions: 5
  - Duration: 10
- [ ] Click "Create Exam" (wait 10-15 seconds)
- [ ] *Expected*: Success message, redirect to dashboard, exam appears in list
- [ ] *Verify*: 5 AI-generated questions created
- [ ] *Result*: PASS / FAIL

### Test 2.2: View Exam Details
- [ ] On dashboard, verify exam card shows:
  - [ ] Title: "JavaScript Quiz"
  - [ ] Topic, difficulty, duration
  - [ ] Status: "⏳ Draft"
- [ ] *Result*: PASS / FAIL

### Test 2.3: Publish Exam
- [ ] Click "Publish" button on exam
- [ ] *Expected*: Success alert
- [ ] *Verify*: Status changes to "✅ Published"
- [ ] *Verify*: "View Leaderboard" and "Full Analytics" buttons appear
- [ ] *Result*: PASS / FAIL

---

## Test Suite 3: Exam Taking (Student)

### Test 3.1: View Available Exams
- [ ] Logout and login as student (alice@test.com)
- [ ] *Expected*: See "JavaScript Quiz" in Available Exams section
- [ ] *Result*: PASS / FAIL

### Test 3.2: Start Exam
- [ ] Click "Start Exam" on JavaScript Quiz
- [ ] *Verify*:
  - [ ] Timer starts counting down
  - [ ] Questions displayed one at a time
  - [ ] All 5 questions loaded
  - [ ] Navigation buttons (Previous/Next) work
- [ ] *Result*: PASS / FAIL

### Test 3.3: Question Randomization
- [ ] Open another browser (or incognito window)
- [ ] Login as different student
- [ ] Start same exam
- [ ] *Verify*: Question order is DIFFERENT from first student
- [ ] *Result*: PASS / FAIL

### Test 3.4: Answer Questions
- [ ] Select answers for all 5 questions
- [ ] Navigate back and forth between questions
- [ ] *Verify*: Selected answers are saved (green highlight)
- [ ] *Result*: PASS / FAIL

### Test 3.5: Submit Exam
- [ ] Click "Submit Exam" on last question
- [ ] Confirm submission
- [ ] *Expected*: Redirect to Review page automatically
- [ ] *Result*: PASS / FAIL

---

## Test 4: Exam Review (Student)

### Test 4.1: View Score Summary
- On Review page, verify score card shows:
  -  Your Score (e.g., 3/5)
  -  Percentage (e.g., 60%)
  -  Time Taken (in minutes and seconds)
  -  Correct count
  -  Incorrect count
- **PASSED**

### Test 4.2: Question Review - Correct Answer
- Find a question you answered correctly
- Badge shows "✓ Correct"
- Correct answer highlighted in GREEN
- Shows "✓ Correct Answer" and "✓ Your Answer"
- **PASSED**


### Test 4.3: Question Review - Wrong Answer
- Find a question you answered incorrectly
- Badge shows "✗ Incorrect"
- Correct answer highlighted in GREEN
- Your wrong answer highlighted in RED
- Shows "✓ Correct Answer" and "✗ Your Answer" on different options
- **PASSED**

### Test 4.4: Return to Dashboard from Review
- Result section shows the name of the exam, score, percentage, date, option to review
- **PASSED**

### Test 4.5: View Review from Dashboard
- Review button should navigate you to the Review Page
- **PASSED**

## Test 5: Analytics & Leaderboard (Examiner)

### Test 5.1: View Dashboard Statistics
- [ ] Login as examiner
- [ ] On dashboard, find published exam card
- [ ] *Verify* statistics section shows:
  - [ ] Total Attempts: 1 (or more)
  - [ ] Average Score
  - [ ] Average Percentage
- [ ] *Result*: PASS / FAIL

### Test 5.2: View Leaderboard
- [ ] Click "View Leaderboard" button
- [ ] *Verify*:
  - [ ] Student name appears
  - [ ] Score and percentage shown
  - [ ] Top performers listed
  - [ ] Sorted by percentage (highest first)
- [ ] *Result*: PASS / FAIL

### Test 5.3: View Full Analytics
- [ ] Go back to dashboard
- [ ] Click "Full Analytics" button
- [ ] *Verify* page shows:
  - [ ] Exam title and details
  - [ ] 4 statistic cards (Total Attempts, Avg Score, Avg %, Pass Rate)
  - [ ] Student Performance table with all columns
  - [ ] Time shown in minutes and seconds
  - [ ] Pass/Fail status badges
  - [ ] Score Distribution chart
- [ ] *Result*: PASS / FAIL

### Test 5.4: Score Distribution Chart
- [ ] On analytics page, scroll to Score Distribution
- [ ] *Verify*:
  - [ ] 5 ranges displayed (0-20%, 21-40%, etc.)
  - [ ] Colored bars show student count
  - [ ] Numbers on bars are correct
- [ ] *Result*: PASS / FAIL

---

## Test 6: Multiple Students

### Test 6.1: Register Additional Students
- Register 2-3 more students
- Have them all take the same exam
- *Verify*: Each gets different question order
-  **PASSED**

### Test 6.2: Updated Analytics
- Login as examiner
- Check analytics page
- *Verify*:
  - Total attempts increased
  -  All students appear in table
  -  Score distribution updated
  -  Average calculations correct
-  **PASSED**

---

## Test 7: Edge Cases

### Test 7.1: Prevent Double Attempt
- As student, try to start an already-completed exam
- *Expected*: Button shows "✓ Completed" and is disabled
-  **PASSED**

### Test 7.2: Timer Expiration
- Start an exam
- Wait for timer to reach 0
- *Expected*: Exam auto-submits
- **FAILED (will be fixing)**

### Test 7.3: Authorization Test
- As student, try to access: http://localhost:5173/examiner/dashboard
- *Expected*: Redirect to student dashboard
- **PASSED**
---

## Test 8: UI/UX

### Test 8.1: Responsive Design
- Resize browser window
- *Verify*: Layout adapts properly on:
  - Desktop (1920x1080)
  - Laptop (1366x768)
  - Tablet (768x1024)
-  **PASSED**

### Test 8.2: Loading States
- Shows quiz is being generated:
  - Creating exam (AI generation)
  - Starting exam
  - Loading dashboards
- **PASSED**
---

## Final Checklist

- All authentication flows work
- AI exam generation working
- Questions properly randomized
- Exam taking smooth
- Auto-evaluation accurate
- Review page shows correct/wrong answers clearly
- Time calculation accurate (minutes + seconds)
- Analytics page comprehensive
- Leaderboard functional
- No console errors
- All buttons/links work
- Authorization prevents unauthorized access

---

