import React, { useEffect, useState } from "react";
import "../styles/ProfessorPage.css";
import { customFetch } from "../httpClient"; // Importăm customFetch

// Funcție de validare pentru UUID
const isValidUUID = (uuid) => {
  const regex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return regex.test(uuid);
};

const ProfessorPage = () => {
  const [students, setStudents] = useState([]); // Datele despre studenți
  const [loading, setLoading] = useState(true); // Starea de încărcare
  const [error, setError] = useState(null); // Starea de eroare
  const [showGradeForm, setShowGradeForm] = useState(false); // Starea pentru formularul de adăugare a notei
  const [showAbsenceForm, setShowAbsenceForm] = useState(false); // Starea pentru formularul de adăugare a absenței
  const [selectedStudent, setSelectedStudent] = useState(null); // Studentul selectat pentru adăugarea notei sau absenței
  const [grade, setGrade] = useState(""); // Nota pe care o va introduce profesorul
  const [subject, setSubject] = useState(""); // Subiectul pentru care se adăugă nota
  const [absenceCount, setAbsenceCount] = useState(""); // Numărul de absențe
  const [absenceSubject, setAbsenceSubject] = useState(""); // Subiectul pentru care se adăugă absența
  const [justified, setJustified] = useState(false); // Justificarea absenței
  const [absenceDate, setAbsenceDate] = useState(""); // Data absenței

  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

        const professorId = localStorage.getItem("professorId");
        if (!professorId || !isValidUUID(professorId)) {
          setError("Professor ID not found or invalid.");
          setLoading(false);
          return;
        }

        const response = await customFetch(
          `http://localhost:8080/teachers/${professorId}/students`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("HTTP error! Status: ${response.status}");
        }

        const data = await response.json();
        setStudents(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch professor data.");
        setLoading(false);
      }
    };

    fetchProfessorData();
  }, []);

  const handleAddGrade = async () => {
    const token = localStorage.getItem("jwtToken");
    const professorId = localStorage.getItem("professorId");

    if (!selectedStudent || !isValidUUID(selectedStudent.studentId)) {
      setError("Invalid student ID.");
      return;
    }

    if (!isValidUUID(professorId)) {
      setError("Invalid professor ID.");
      return;
    }

    const gradeData = {
      studentId: selectedStudent.studentId,
      professorId: professorId,
      subject: subject,
      grade: grade,
      date: new Date().toISOString(),
    };

    try {
      const response = await customFetch(
        `http://localhost:8080/teachers/students/${selectedStudent.studentId}/grades`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(gradeData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add grade.");
      }

      const updatedStudent = await response.json();
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.studentId === updatedStudent.id ? updatedStudent : student
        )
      );
      setShowGradeForm(false);
    } catch (error) {
      setError("Failed to add grade.");
    }
  };

  const handleAddAbsence = async () => {
    const token = localStorage.getItem("jwtToken");
    const professorId = localStorage.getItem("professorId");

    if (!selectedStudent || !isValidUUID(selectedStudent.studentId)) {
      setError("Invalid student ID.");
      return;
    }

    if (!isValidUUID(professorId)) {
      setError("Invalid professor ID.");
      return;
    }

    const absenceData = {
      studentId: selectedStudent.studentId,
      teacherId: professorId,
      subject: absenceSubject,
      justified: justified, // Include the justified flag
      date: absenceDate, // Use the selected absence date
    };

    try {
      const response = await customFetch(
        `http://localhost:8080/teachers/students/${selectedStudent.studentId}/absences`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(absenceData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add absence.");
      }

      const updatedStudent = await response.json();
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.studentId === updatedStudent.id ? updatedStudent : student
        )
      );
      setShowAbsenceForm(false);
    } catch (error) {
      setError("Failed to add absence.");
    }
  };

  const handleShowGradeForm = (student) => {
    setSelectedStudent(student);
    console.log('Selected student for grade form:', student);
    setShowGradeForm(true);
  };

  const handleShowAbsenceForm = (student) => {
    setSelectedStudent(student);
    setShowAbsenceForm(true);
  };

  const handleSignOut = () => {
    // Clear the localStorage and redirect to the login page
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("professorId");
    window.location.href = "/"; // Update the route to match your application's login path
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <div className="Professor">
      {/* Header Section */}
      <div className="professor-header">
        <button onClick={() => handleSignOut()} className="sign-out-btn">
          Sign Out
        </button>
      </div>
  
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.studentId}>
                  <td>{student.fullName}</td>
                  <td>{student.email}</td>
                  <tbody>
                    {Object.entries(student.grades).map(([subject, grade]) => (
                      // <div key={subject}>
                      //   {subject}: {grade}
                      // </div>
                      <tr key={subject}>
                        <td>{subject}</td>
                        <td>{grade}</td>
                      </tr>
                    ))}
                  </tbody>
                  <td>
                    {Object.entries(student.absences).map(
                      ([subject, absenceCount]) => (
                        <div key={subject}>
                          {subject}: {absenceCount}
                        </div>
                      )
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleShowGradeForm(student)}>
                      Add Grade
                    </button>
                    <button onClick={() => handleShowAbsenceForm(student)}>
                      Add Absence
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {showGradeForm && selectedStudent && (
          <div className="grade-form">
            <h3>Add Grade for {selectedStudent.fullName}</h3>
            <label>
              Subject:
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </label>
            <label>
              Grade:
              <input
                type="number"
                min="1"
                max="10"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
            </label>
            <button onClick={handleAddGrade}>Add Grade</button>
            <button onClick={() => setShowGradeForm(false)}>Cancel</button>
          </div>
        )}
  
        {showAbsenceForm && selectedStudent && (
          <div className="absence-form">
            <h3>Add Absence for {selectedStudent.fullName}</h3>
            <label>
              Subject:
              <input
                type="text"
                value={absenceSubject}
                onChange={(e) => setAbsenceSubject(e.target.value)}
              />
            </label>
            <label>
              Absence Count:
              <input
                type="number"
                min="0"
                value={absenceCount}
                onChange={(e) => setAbsenceCount(e.target.value)}
              />
            </label>
            <label>
              Justified:
              <input
                type="checkbox"
                checked={justified}
                onChange={() => setJustified(!justified)}
              />
            </label>
            <label>
              Date:
              <input
                type="date"
                value={absenceDate}
                onChange={(e) => setAbsenceDate(e.target.value)}
              />
            </label>
            <button onClick={handleAddAbsence}>Add Absence</button>
            <button onClick={() => setShowAbsenceForm(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default ProfessorPage;