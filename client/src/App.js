import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import StudentPage from "./pages/StudentPage";
import RegisterPage from "./pages/RegisterPage";
import ProfessorPage from "./pages/ProfessorPage";
import ModifyPage from "./pages/ModifyPage";
import CreateClassPage from "./pages/CreateClassPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/professor" element={<ProfessorPage />} />
        <Route path="/admin" element={<RegisterPage/>}/>
        <Route path="/modify" element={<ModifyPage/>}/>
        <Route path="/addClass" element={<CreateClassPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
