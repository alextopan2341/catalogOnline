import React, { useState } from "react";
import "../styles/LoginStyle.css";
import { getUser, login } from "../utils/LoginCalls";
import { useNavigate, Link } from "react-router-dom";
import TransitionAlerts from "../utils/TransitionAlert";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [apiError, setApiError] = useState(null);

  const handleLogin = async () => {
    login(email, password)
      .then((response) => {
        console.log(response);

        const token = response.token; // Presupunând că tokenul vine în răspunsul de la server
        const professorId = response.professorId;
        localStorage.setItem("jwtToken", response);

        getUser().then((user) => {
          localStorage.setItem("user", JSON.stringify(user));

          // Verificăm rolul utilizatorului și redirecționăm în consecință
          if (user.role === "STUDENT") {
            navigate("/student"); // Redirecționare către StudentPage
          } else if (user.role === "PROFESSOR") {
            localStorage.setItem("professorId", user.id);
            navigate("/professor"); // Redirecționare către ProfessorPage
          }
        });
      })
      .catch((error) => {
        console.log(error);
        HandleError({ error });
      });
  };

  function HandleError({ error }) {
    if (error && error.response && error.response.status === 401) {
      localStorage.removeItem("jwtToken");
      setApiError("Wrong username or password for " + email);
    } else if (error && error.message) {
      setApiError("Error: " + error);
    } else {
      setApiError("An unknown error occurred.");
    }
  }

  return (
    <div className="Login">
      <form>
        {apiError && <TransitionAlerts message={apiError} />}
        <h1>Catalog Online</h1>
        <input
          type="text"
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
        <button type="button" onClick={handleLogin} className="login-btn">
          Login
        </button>
        <div className="register-section">
          <p>Don't have an account?</p>
          <Link to="/register">
            <button type="button" className="register-btn">
              Register Free
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
