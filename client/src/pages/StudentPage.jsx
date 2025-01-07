import React, { useEffect, useState } from "react";
import "../styles/StudentPage.css";
import { customFetch } from "../httpClient"; // Importăm customFetch

const StudentPage = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          setError("User not logged in.");
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
        setError("Failed to fetch student data.");
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="Student">
      <div className="student-content">
        <h1>Welcome, {studentData?.fullName}!</h1>
        <p>This is your student dashboard.</p>

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

        <div className="absences">
          <h3>Your Absences</h3>
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Absences</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(studentData.absences).map(
                ([subject, absenceCount]) => (
                  <tr key={subject}>
                    <td>{subject}</td>
                    <td>{absenceCount}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;