import React, { useEffect, useState } from "react";
import "../styles/RegisterStyle.css";
import { useNavigate } from "react-router-dom";
import TransitionAlerts from "../utils/TransitionAlert";
import SideMenu from "../utils/SideMenu";
import "../styles/AdminStyle.css"
import Select from 'react-select';
const CreateClassPage = () =>{
    const [className, setClassName] = useState("");
    const [professor, setProfessor] = useState("");
    const [professors, setProfessors] = useState([]);
    const [students,setStudents] = useState([]);
    const [selectedStud,setSelectedStuds] = useState([]);
    const [apiError, setApiError] = useState(null);
    const [succesMsg,setSuccesMsg] = useState(null)
    useEffect(()=>{
        async function getProfs() {
            try {
                const response = await fetch("http://localhost:8080/user/getProfessors", {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('jwtToken')
                  }
                });
        
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
        
                const data = await response.json();
                let classesFetched = data.map((clasa) => ({
                  value: clasa.id,
                  label: clasa.fullName
                }));
        
                setProfessors(classesFetched);
              } catch (error) {
                setApiError(error.message || "An error occurred while fetching classes.");
              }
        }

        async function getStudents() {
            try {
                const response = await fetch("http://localhost:8080/user/getStudents", {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('jwtToken')
                  }
                });
        
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
        
                const data = await response.json();
                let classesFetched = data.map((clasa) => ({
                  value: clasa.id,
                  label: clasa.fullName
                }));
        
                setStudents(classesFetched);
              } catch (error) {
                setApiError(error.message || "An error occurred while fetching classes.");
              }
        }
        getProfs()
        getStudents()
    },[])
    const handleSubmit = async () =>{
        if(className === ""){
            setApiError("Enter a classroom name");
            return;
        }
        let studentIds = selectedStud.map((stud)=>(stud.value));
        let teacherId = professor.value;
        let name = className;
        let students= new Map()
        const ClassroomDto = {
            teacherId,
            name,
            studentIds,
            students
        }
        try {
            const response = await fetch("http://localhost:8080/classrooms", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization":"Bearer " +localStorage.getItem('jwtToken')
              },
              body: JSON.stringify(ClassroomDto),
            });
      
            if (response.ok) {
              const data = await response.json();
              console.log("Classroom registered:", data);
              setSuccesMsg("Classroom adaugat cu succces!")
            } else {
              const errorMessage = await response.text();
              setApiError(errorMessage);
            }
          } catch (error) {
            console.error("Error during registration:", error);
            setApiError("An error occurred while registering.");
          }
    }
    return(
    <div>
      <div className="menu-container">
        <SideMenu />
      </div>
      <div className="Register">
        <form>
            {apiError && <TransitionAlerts message={apiError} />}
                    <div className="succes">
                      {succesMsg != null && succesMsg}
                    </div>
        <h1>Create an Classroom</h1>
            <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Class Name"
                />
            <div className="register-section">
                <label htmlFor="classSelect">Select Professor</label>
                <Select
                    id="classSelect"
                    options={professors}
                    className="basic-single-select"
                    classNamePrefix="select"
                    onChange={(selectedOption) => setProfessor(selectedOption)}
                />
            </div>
            {professor !== null && (
            <div className="register-section">
                <label htmlFor="studentSelect">Select Students</label>
                <Select
                id="studentSelect"
                isMulti
                options={students}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(selectedOptions) => setSelectedStuds(selectedOptions)}
                />
            </div>
            )}
            <button type="button" className="register-btn" onClick={handleSubmit}>
            Add ClassRoom
            </button>
        </form>
      </div>
    </div>
    )

}
export default CreateClassPage;