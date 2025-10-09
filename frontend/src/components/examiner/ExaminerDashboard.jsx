import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../services/api";

export default function ExaminerDashboard() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await api.get("/examiner/exams");
      setExams(response.data.data);
    } catch (error) {
      console.error("Fetch exams error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (examId) => {
    try {
      await api.put(`/examiner/exams/${examId}/publish`);
      alert("Exam published successfully!");
      fetchExams();
    } catch (error) {
      alert("Failed to publish exam");
    }
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>Examiner Dashboard</h2>
        <div>
          <span>Welcome, {user.name}</span>
          <button onClick={logout} className="btn-secondary">
            Logout
          </button>
        </div>
      </nav>

      <div className="content">
        <div className="header">
          <h1>My Exams</h1>
          <button
            onClick={() => navigate("/examiner/create-exam")}
            className="btn-primary"
          >
            Create New Exam
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : exams.length === 0 ? (
          <div className="empty-state">
            <p>No exams created yet. Create your first exam!</p>
          </div>
        ) : (
          <div className="exam-grid">
            {exams.map((exam) => (
              <div key={exam.id} className="exam-card">
                <h3>{exam.title}</h3>
                <p>
                  <strong>Topic:</strong> {exam.topic}
                </p>
                <p>
                  <strong>Difficulty:</strong> {exam.difficulty_level}
                </p>
                <p>
                  <strong>Questions:</strong> {exam.total_questions}
                </p>
                <p>
                  <strong>Duration:</strong> {exam.duration} minutes
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {exam.is_published ? "✅ Published" : "⏳ Draft"}
                </p>

                <div className="card-actions">
                  {!exam.is_published && (
                    <button
                      onClick={() => handlePublish(exam.id)}
                      className="btn-primary"
                    >
                      Publish
                    </button>
                  )}
                  {exam.is_published && (
                    <button
                      onClick={() =>
                        navigate(`/examiner/exam/${exam.id}/leaderboard`)
                      }
                      className="btn-secondary"
                    >
                      View Leaderboard
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
