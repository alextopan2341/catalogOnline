import React, { useEffect, useState } from "react";
import "../styles/ProfessorPage.css";
import { customFetch } from "../httpClient"; // Importăm customFetch

const ProfessorPage = () => {
  const [students, setStudents] = useState([]); // Datele despre studenți
  const [loading, setLoading] = useState(true); // Starea de încărcare
  const [error, setError] = useState(null); // Starea de eroare

  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        // Verificăm dacă token-ul există înainte de a face cererea
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

        // Extragem ID-ul profesorului din JWT sau dintr-o altă sursă
        const professorId = localStorage.getItem("professorId"); // Sau extragi din JWT
        console.log(professorId);
        if (!professorId) {
          setError("Professor ID not found.");
          setLoading(false);
          return;
        }

        // Apelăm endpoint-ul pentru a obține studenții asociati profesorului logat
        const response = await customFetch(
          `http://localhost:8080/teachers/${professorId}/students`, // Endpoint pentru studenții asociati profesorului
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Adăugăm token-ul pentru autentificare
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Convertește răspunsul la JSON
        const data = await response.json();

        // Verificăm ce date sunt returnate
        console.log("Professor students data:", data);

        // Setează datele despre studenți
        setStudents(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching professor data:", err);
        setError("Failed to fetch professor data.");
        setLoading(false);
      }
    };

    fetchProfessorData(); // Apelăm funcția pentru a aduce datele
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
    <div className="Professor">
      <div className="professor-content">
        <h1>Welcome, Professor!</h1>
        <p>This is your dashboard.</p>

        <div className="dashboard-section">
          <h3>Your Students</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Grades</th>
                <th>Absences</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.fullName}</td>
                  <td>{student.email}</td>
                  <td>
                    {Object.entries(student.grades).map(([subject, grade]) => (
                      <div key={subject}>
                        {subject}: {grade}
                      </div>
                    ))}
                  </td>
                  <td>
                    {Object.entries(student.absences).map(
                      ([subject, absenceCount]) => (
                        <div key={subject}>
                          {subject}: {absenceCount}
                        </div>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfessorPage;
