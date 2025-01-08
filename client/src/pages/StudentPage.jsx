import React, { useEffect, useState } from "react";
import "../styles/StudentPage.css";
import { customFetch } from "../httpClient"; // Importăm customFetch
import { useNavigate } from "react-router-dom"; // Importăm useNavigate for redirection

const StudentPage = () => {
  const [studentData, setStudentData] = useState(null);
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({ studentData: null, absences: null });
  const navigate = useNavigate(); // For redirecting to login page

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          setError((prev) => ({ ...prev, studentData: "User not logged in." }));
          setLoading(false);
          return;
        }

        const response = await customFetch(
          "http://localhost:8080/user/student",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setStudentData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError((prev) => ({ ...prev, studentData: "Failed to fetch student data." }));
        setLoading(false);
      }
    };

    const fetchAbsences = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          setError((prev) => ({ ...prev, absences: "User not logged in." }));
          setLoading(false);
          return;
        }

        const studentId = localStorage.getItem("studentId");
        const response = await customFetch(
          `http://localhost:8080/teachers/students/${studentId}/absences`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const absencesData = await response.json();
        setAbsences(absencesData);
      } catch (err) {
        console.error("Error fetching absences:", err);
        setError((prev) => ({ ...prev, absences: "Failed to fetch absences." }));
      }
    };

    fetchStudentData();
    fetchAbsences();
  }, []);

  // Handle Sign Out
  const handleSignOut = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("studentId");
    navigate("/"); // Redirect to login page using useNavigate
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error.studentData || error.absences) {
    return <div>Error: {error.studentData || error.absences}</div>;
  }

  return (
    <div className="Student">
      <div className="student-content">
        {/* Sign Out Button */}
        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>

        <h1>Welcome, {studentData?.fullName}!</h1>
        <p>This is your student dashboard.</p>

        {/* Display grades */}
        <div className="grades">
          <h3>Your Grades</h3>
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(studentData.grades).map(([subject, grade]) => (
                <tr key={subject}>
                  <td>{subject}</td>
                  <td>{grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Display absences */}
        <div className="absences">
          <h3>Your Absences</h3>
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Date</th>
                <th>Justified</th>
              </tr>
            </thead>
            <tbody>
              {absences.length === 0 ? (
                <tr>
                  <td colSpan="3">No absences recorded.</td>
                </tr>
              ) : (
                absences.map((absence) => (
                  <tr key={absence.id}>
                    <td>{absence.subject}</td>
                    <td>{new Date(absence.date).toLocaleDateString()}</td>
                    <td>{absence.justified ? "Yes" : "No"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;