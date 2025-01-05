import React, { useEffect, useState } from "react";
import { customFetch } from "../httpClient"; // Importăm customFetch

const StudentPage = () => {
  const [studentData, setStudentData] = useState(null); // Stocăm datele studentului
  const [loading, setLoading] = useState(true); // Starea de încărcare
  const [error, setError] = useState(null); // Starea de eroare

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Verificăm dacă token-ul există înainte de a face cererea
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

        // Apelăm customFetch pentru a obține datele studentului
        const response = await customFetch(
          "http://localhost:8080/user/student", // URL-ul backend-ului
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Adăugăm token-ul
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Convertește răspunsul la JSON
        const data = await response.json();

        // Verificăm ce date sunt returnate
        console.log("Student data:", data);

        // Setează datele studentului
        setStudentData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("Failed to fetch student data.");
        setLoading(false);
      }
    };

    fetchStudentData(); // Apelăm funcția pentru a aduce datele
  }, []);

  // Dacă datele sunt încă încărcate
  if (loading) {
    return <div>Loading...</div>;
  }

  // Dacă a apărut o eroare
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Welcome, {studentData?.fullName}!</h2>
      <p>This is your student dashboard.</p>

      <div>
        <h3>Your Grades</h3>
        <ul>
          {Object.entries(studentData.grades).map(([subject, grade]) => (
            <li key={subject}>
              {subject}: {grade}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Your Absences</h3>
        <ul>
          {Object.entries(studentData.absences).map(
            ([subject, absenceCount]) => (
              <li key={subject}>
                {subject}: {absenceCount} absences
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default StudentPage;
