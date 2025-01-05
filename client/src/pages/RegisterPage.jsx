import React, { useState } from "react";
import "../styles/RegisterStyle.css";
import { useNavigate } from "react-router-dom";
import TransitionAlerts from "../utils/TransitionAlert";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("STUDENT"); // Valoare implicită
  const [subjects, setSubjects] = useState([]);
  const [apiError, setApiError] = useState(null);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setApiError("Passwords do not match.");
      return;
    }

    const userRegisterDto = {
      fullName,
      email,
      password,
      confirmPassword,
      role,
      subjects,
    };

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userRegisterDto),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User registered:", data);
        navigate("/login");
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
    <div className="Register">
      <form>
        {apiError && <TransitionAlerts message={apiError} />}
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
            <option value="STUDENT">Student</option>
            <option value="PROFESSOR">Professor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

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

        <button type="button" onClick={handleRegister} className="register-btn">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
