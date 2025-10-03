const { supabaseAdmin } = require("../config/database");
const { shuffleArray, calculatePercentage } = require("../utils/helpers");

// Get all published exams available to students
const getAvailableExams = async (req, res) => {
  try {
    const { data: exams, error } = await supabaseAdmin
      .from("exams")
      .select(
        `
        id,
        title,
        topic,
        difficulty_level,
        duration,
        total_questions,
        published_at
      `
      )
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: exams,
    });
  } catch (error) {
    console.error("Get available exams error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get exams",
      error: error.message,
    });
  }
};

// Start exam attempt
const startExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const studentId = req.user.userId;

    // Check if exam exists and is published
    const { data: exam, error: examError } = await supabaseAdmin
      .from("exams")
      .select("*")
      .eq("id", examId)
      .eq("is_published", true)
      .single();

    if (examError || !exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found or not available",
      });
    }

    // Check if student already attempted this exam
    // const { data: existingAttempt } = await supabaseAdmin
    //   .from("student_exam_attempts")
    //   .select("*")
    //   .eq("student_id", studentId)
    //   .eq("exam_id", examId)
    //   .single();

    // if (existingAttempt) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "You have already attempted this exam",
    //   });
    // }

    // Get questions
    const { data: questions, error: questionsError } = await supabaseAdmin
      .from("questions")
      .select("id, question_text, option_a, option_b, option_c, option_d")
      .eq("exam_id", examId)
      .order("question_order", { ascending: true });

    if (questionsError) throw questionsError;

    // Randomize question order for this student
    const questionIds = questions.map((q) => q.id);
    const randomizedOrder = shuffleArray(questionIds);

    // Create exam attempt record
    const { data: attempt, error: attemptError } = await supabaseAdmin
      .from("student_exam_attempts")
      .insert([
        {
          student_id: studentId,
          exam_id: examId,
          randomized_question_order: randomizedOrder,
        },
      ])
      .select()
      .single();

    if (attemptError) throw attemptError;

    // Return questions in randomized order
    const randomizedQuestions = randomizedOrder.map((qId) =>
      questions.find((q) => q.id === qId)
    );

    res.status(200).json({
      success: true,
      message: "Exam started successfully",
      data: {
        attemptId: attempt.id,
        exam: {
          id: exam.id,
          title: exam.title,
          duration: exam.duration,
          totalQuestions: exam.total_questions,
        },
        questions: randomizedQuestions,
        startTime: attempt.start_time,
      },
    });
  } catch (error) {
    console.error("Start exam error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to start exam",
      error: error.message,
    });
  }
};

// Submit answer for a question
const submitAnswer = async (req, res) => {
  try {
    const { attemptId, questionId, selectedOption } = req.body;
    const studentId = req.user.userId;

    // Verify attempt belongs to student
    const { data: attempt, error: attemptError } = await supabaseAdmin
      .from("student_exam_attempts")
      .select("*")
      .eq("id", attemptId)
      .eq("student_id", studentId)
      .single();

    if (attemptError || !attempt) {
      return res.status(404).json({
        success: false,
        message: "Exam attempt not found",
      });
    }

    if (attempt.is_submitted) {
      return res.status(400).json({
        success: false,
        message: "Exam already submitted",
      });
    }

    // Get correct answer
    const { data: question, error: questionError } = await supabaseAdmin
      .from("questions")
      .select("correct_answer")
      .eq("id", questionId)
      .single();

    if (questionError) throw questionError;

    const isCorrect = selectedOption === question.correct_answer;

    // Upsert response (insert or update if exists)
    const { error: responseError } = await supabaseAdmin
      .from("student_responses")
      .upsert(
        [
          {
            attempt_id: attemptId,
            question_id: questionId,
            selected_option: selectedOption,
            is_correct: isCorrect,
            answered_at: new Date(),
          },
        ],
        {
          onConflict: "attempt_id,question_id",
        }
      );

    if (responseError) throw responseError;

    res.status(200).json({
      success: true,
      message: "Answer saved successfully",
    });
  } catch (error) {
    console.error("Submit answer error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save answer",
      error: error.message,
    });
  }
};

// Submit entire exam
const submitExam = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const studentId = req.user.userId;

    // Verify attempt belongs to student
    const { data: attempt, error: attemptError } = await supabaseAdmin
      .from("student_exam_attempts")
      .select("*")
      .eq("id", attemptId)
      .eq("student_id", studentId)
      .single();

    if (attemptError || !attempt) {
      return res.status(404).json({
        success: false,
        message: "Exam attempt not found",
      });
    }

    if (attempt.is_submitted) {
      return res.status(400).json({
        success: false,
        message: "Exam already submitted",
      });
    }

    // Mark attempt as submitted
    await supabaseAdmin
      .from("student_exam_attempts")
      .update({
        is_submitted: true,
        submission_time: new Date(),
        end_time: new Date(),
      })
      .eq("id", attemptId);

    // Get all responses
    const { data: responses, error: responsesError } = await supabaseAdmin
      .from("student_responses")
      .select("is_correct")
      .eq("attempt_id", attemptId);

    if (responsesError) throw responsesError;

    // Calculate score
    const correctAnswers = responses.filter((r) => r.is_correct).length;
    const totalQuestions = attempt.randomized_question_order.length;
    const percentage = calculatePercentage(correctAnswers, totalQuestions);

    // Calculate time taken
    const startTime = new Date(attempt.start_time);
    const endTime = new Date();
    const timeTaken = Math.round((endTime - startTime) / 60000); // in minutes

    // Save result
    const { data: result, error: resultError } = await supabaseAdmin
      .from("results")
      .insert([
        {
          attempt_id: attemptId,
          student_id: studentId,
          exam_id: attempt.exam_id,
          score: correctAnswers,
          total_questions: totalQuestions,
          percentage: percentage,
          time_taken: timeTaken,
        },
      ])
      .select()
      .single();

    if (resultError) throw resultError;

    res.status(200).json({
      success: true,
      message: "Exam submitted successfully",
      data: {
        score: correctAnswers,
        totalQuestions: totalQuestions,
        percentage: percentage,
        timeTaken: timeTaken,
      },
    });
  } catch (error) {
    console.error("Submit exam error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit exam",
      error: error.message,
    });
  }
};

// Get student's exam results
const getMyResults = async (req, res) => {
  try {
    const studentId = req.user.userId;

    const { data: results, error } = await supabaseAdmin
      .from("results")
      .select(
        `
        *,
        exams:exam_id (title, topic, difficulty_level, total_questions)
      `
      )
      .eq("student_id", studentId)
      .order("evaluated_at", { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Get my results error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get results",
      error: error.message,
    });
  }
};

// Get detailed result for a specific exam
const getExamResult = async (req, res) => {
  try {
    const { examId } = req.params;
    const studentId = req.user.userId;

    // Get result
    const { data: result, error: resultError } = await supabaseAdmin
      .from("results")
      .select(
        `
        *,
        exams:exam_id (title, topic, difficulty_level),
        student_exam_attempts!inner (id)
      `
      )
      .eq("student_id", studentId)
      .eq("exam_id", examId)
      .single();

    if (resultError || !result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get exam result error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get result",
      error: error.message,
    });
  }
};

module.exports = {
  getAvailableExams,
  startExam,
  submitAnswer,
  submitExam,
  getMyResults,
  getExamResult,
};
