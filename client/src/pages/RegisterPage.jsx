import React, { useEffect, useState } from "react";
import "../styles/RegisterStyle.css";
import { useNavigate } from "react-router-dom";
import TransitionAlerts from "../utils/TransitionAlert";
import SideMenu from "../utils/SideMenu";
import "../styles/AdminStyle.css";
import Select from "react-select";
const RegisterPage = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(""); // Nu mai setăm o valoare implicită
  const [subjects, setSubjects] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [succesMsg, setSuccesMsg] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch(
          "http://localhost:8080/classrooms/getClasses",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwtToken"),
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        let classesFetched = Object.entries(data).map(([key, value]) => ({
          label: key,
          value: value,
        }));

        console.log(classesFetched);
        setClasses(classesFetched);
      } catch (error) {
        setApiError(
          error.message || "An error occurred while fetching classes."
        );
      }
    }
    getData();
  }, []);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setApiError("Passwords do not match.");
      return;
    }
    if (role === "") {
      // Verificăm dacă rolul nu este selectat
      setApiError("Please select a role.");
      return;
    }
    let classroom = selectedClass ? selectedClass.value : "";
    const userRegisterDto = {
      fullName,
      email,
      password,
      confirmPassword,
      role,
      subjects,
      classroom,
    };

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwtToken"),
        },
        body: JSON.stringify(userRegisterDto),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User registered:", data);
        // După înregistrare, redirecționăm utilizatorul
        // if (role === "STUDENT") {
        //   navigate("/student"); // Redirecționare către StudentPage
        // } else if (role === "PROFESSOR") {
        //   navigate("/professor"); // Redirecționare către ProfessorPage
        // }
        setSuccesMsg("User adaugat cu succces!");
      } else {
        const errorMessage = await response.text();
        setApiError(errorMessage);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setApiError("An error occurred while registering.");
    }
  };

  const handleSubjectChange = (event) => {
    const value = event.target.value;
    if (subjects.includes(value)) {
      setSubjects(subjects.filter((subject) => subject !== value));
    } else {
      setSubjects([...subjects, value]);
    }
  };
  return (
    <div>
      <div className="menu-container">
        <SideMenu />
      </div>
      <div className="Register">
        <form>
          {apiError && <TransitionAlerts message={apiError} />}
          <div className="succes">{succesMsg != null && succesMsg}</div>
          <h1>Create an Account</h1>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />

          {/* Dropdown pentru rol */}
          <div className="register-section">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select Role</option> {/* Opțiune goală */}
              <option value="STUDENT">Student</option>
              <option value="PROFESSOR">Professor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          {role === "STUDENT" && (
            <div className="register-section">
              <label htmlFor="role">Class</label>
              <Select
                name="colors"
                options={classes}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(e) => setSelectedClass(e)}
              />
            </div>
          )}
          {/* Dropdown pentru subiecte */}
          <div className="register-section">
            <label htmlFor="subjects">Subjects:</label>
            <div id="subjects" className="checkbox-container">
              {[
                "ROMANA",
                "INFORMATICA",
                "MATEMATICA",
                "BIOLOGIE",
                "CHIMIE",
                "FIZICA",
                "ISTORIE",
                "DESEN",
                "SPORT",
                "ENGLEZA",
              ].map((subject) => (
                <label key={subject} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={subject}
                    checked={subjects.includes(subject)}
                    onChange={handleSubjectChange}
                  />
                  {subject}
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleRegister}
            className="register-btn"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
