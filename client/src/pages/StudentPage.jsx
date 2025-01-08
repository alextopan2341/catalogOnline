// import React, { useEffect, useState } from "react";
// import "../styles/StudentPage.css";
// import { customFetch } from "../httpClient"; // Importăm customFetch

// const StudentPage = () => {
//   const [studentData, setStudentData] = useState(null); // Stocăm datele studentului
//   const [loading, setLoading] = useState(true); // Starea de încărcare
//   const [error, setError] = useState(null); // Starea de eroare

//   useEffect(() => {
//     const fetchStudentData = async () => {
//       try {
//         // Verificăm dacă token-ul există înainte de a face cererea
//         const token = localStorage.getItem("jwtToken");
//         if (!token) {
//           setError("User not logged in.");
//           setLoading(false);
//           return;
//         }

//         // Apelăm customFetch pentru a obține datele studentului
//         const response = await customFetch(
//           "http://localhost:8080/user/student", // URL-ul backend-ului
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`, // Adăugăm token-ul
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         // Convertește răspunsul la JSON
//         const data = await response.json();

//         // Verificăm ce date sunt returnate
//         console.log("Student data:", data);

//         // Setează datele studentului
//         setStudentData(data);

//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching student data:", err);
//         setError("Failed to fetch student data.");
//         setLoading(false);
//       }
//     };

//     fetchStudentData(); // Apelăm funcția pentru a aduce datele
//   }, []);

//   // Dacă datele sunt încă încărcate
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // Dacă a apărut o eroare
//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className="Student">
//       <div className="student-content">
//         <h1>Welcome, {studentData?.fullName}!</h1>
//         <p>This is your student dashboard.</p>
//         <div className="grades">
//           <h3>Your Grades</h3>
//           <table>
//             <thead>
//               <tr>
//                 <th>Subject</th>
//                 <th>Grade</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(studentData.grades).map(([subject, grade]) => (
//                 <tr key={subject}>
//                   <td>{subject}</td>
//                   <td>{grade}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="absences">
//           <h3>Your Absences</h3>
//           <table>
//             <thead>
//               <tr>
//                 <th>Subject</th>
//                 <th>Absences</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(studentData.absences).map(
//                 ([subject, absenceCount]) => (
//                   <tr key={subject}>
//                     <td>{subject}</td>
//                     <td>{absenceCount}</td>
//                   </tr>
//                 )
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentPage;
import React, { useEffect, useState } from "react";
import "../styles/StudentPage.css";
import { customFetch } from "../httpClient"; // Importăm customFetch

const StudentPage = () => {
  const [studentData, setStudentData] = useState(null); // Stocăm datele studentului
  const [absences, setAbsences] = useState([]); // Stocăm absențele studentului
  const [loading, setLoading] = useState(true); // Starea de încărcare
  const [error, setError] = useState(null); // Starea de eroare

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
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

        const data = await response.json();
        setStudentData(data); // Setează datele studentului
        setLoading(false);
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("Failed to fetch student data.");
        setLoading(false);
      }
    };

    const fetchAbsences = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

        // Obținem ID-ul studentului din token sau altă metodă
        const studentId = localStorage.getItem("studentId");
        console.log(studentId);
        const response = await customFetch(
          `http://localhost:8080/teachers/students/${studentId}/absences`, // Endpoint pentru absențe
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

        const absencesData = await response.json();
        setAbsences(absencesData); // Setează absențele
      } catch (err) {
        console.error("Error fetching absences:", err);
        setError("Failed to fetch absences.");
      }
    };

    fetchStudentData(); // Apelăm funcția pentru a aduce datele
    fetchAbsences(); // Apelăm funcția pentru a aduce absențele
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
                    <td>{absence.date}</td>
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
