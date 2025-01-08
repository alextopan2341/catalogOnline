import React, { useEffect, useState } from "react";
import "../styles/RegisterStyle.css";
import { useNavigate } from "react-router-dom";
import TransitionAlerts from "../utils/TransitionAlert";
import SideMenu from "../utils/SideMenu";
import "../styles/AdminStyle.css";
import Select from 'react-select';

const ModifyPage = () => {
  const [classes, setClasses] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [professor, setProfessor] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [succesMsg,setSuccesMsg] = useState(null)
  const [oldProfs,setOldProfs] = useState({value:"prof5",label:"prof5"});
  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch("http://localhost:8080/classrooms/getClasses", {
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
        let classesFetched = Object.entries(data).map(([key, value]) => ({
            label: key,   
            value: value  
          }));

        setClasses(classesFetched);
      } catch (error) {
        setApiError(error.message || "An error occurred while fetching classes.");
      }
    }
    getData();
  }, []);

  useEffect(() => {
    if (!selectedClass) return;

    async function getClassroom() {
      try {
        const response = await fetch(`http://localhost:8080/classrooms/${selectedClass}/classroom`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('jwtToken')
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        let fetchStudents  = Object.entries(data.students).map(([key, value]) => ({
            label: value,   
            value: key  
          }));
        let prof ={
            id:data.techerId,
            name:data.teacherName
        }
        setProfessor(prof);
        console.log(fetchStudents)
        setSelectedStudents(fetchStudents);
      } catch (error) {
        setApiError(error.message || "An error occurred while fetching professors.");
      }
    }
    async function getData() {
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
          let studentsFetched = data.map((clasa) => ({
            value: clasa.id,
            label: clasa.fullName
          }));
    
          console.log(studentsFetched);
          setStudents(studentsFetched)
        } catch (error) {
          setApiError(error.message || "An error occurred while fetching classes.");
        }
      }
      getData();
      getClassroom();
  }, [selectedClass]);
  const handleSubmit = async () =>{
    let studentIds = selectedStudents.map((stud)=>(stud.value));
    let AddStudentDto = {studentIds};
    try {
        const response = await fetch(`http://localhost:8080/classrooms/${selectedClass}/students`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization":"Bearer " +localStorage.getItem('jwtToken')
          },
          body: JSON.stringify(AddStudentDto),
        });
  
        if (response.ok) {
          const data = await response.json();
          setSuccesMsg("Classroom modificat cu succces!")
        } else {
          const errorMessage = await response.text();
          setApiError(errorMessage);
        }
      } catch (error) {
        console.error("Error during registration:", error);
        setApiError("An error occurred while modyifing.");
      }

  }
  return (
    <div>
      <div className="menu-container">
        <SideMenu />
      </div>
    
        <div className="Register">
        <form>
            <div className="register-section">
            <label htmlFor="classSelect">Select Class</label>
            <Select
                id="classSelect"
                options={classes}
                className="basic-single-select"
                classNamePrefix="select"
                onChange={(selectedOption) => setSelectedClass(selectedOption.value)}
            />
            </div>

            {professor !==null && (
            <div className="register-section">
                <label htmlFor="professorSelect"> Professors</label>
                <input
                    type="text"
                    value={professor.name}
                    readOnly={true}
                    />
            </div>
            )}
            {students.length > 0 && 
            <div className="register-section">
                <label htmlFor="studentSelect">Select Students</label>
                <Select
                id="studentSelect"
                isMulti
                options={students}
                className="basic-multi-select"
                classNamePrefix="select"
                value={selectedStudents}
                onChange={(selectedOptions) => setSelectedStudents(selectedOptions)}
                />
            </div>
            }

        <button type="submit" className="register-btn" onClick={handleSubmit}>
          Save Changes
        </button>
        </form>
        </div>
        
      
    </div>
  );
};

export default ModifyPage;
