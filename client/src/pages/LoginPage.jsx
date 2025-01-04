import React, { useState } from 'react';
import '../styles/LoginStyle.css'
import { getUser, login } from '../utils/LoginCalls';
import { useNavigate } from "react-router-dom";
import TransitionAlerts from '../utils/TransitionAlert';
const LoginPage = () =>{
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [apiError, setApiError] = useState(null);

    const  handleLogin = async () => {
         login(email,password).then((response)=>{
            console.log(response)
          
          localStorage.setItem('jwtToken',response)
          //localStorage.setItem('userName',username)
          getUser().then((user)=>{
            localStorage.setItem('user',user)
          })
          navigate("/main")
         }).catch(error=>{
            console.log(error)
            HandleError({error})
          });
        
      };

    function HandleError({ error }) {
        if (error && error.response && error.response.status === 401) {
          localStorage.removeItem("jwtToken");
          setApiError("Wrong username or pasword for "+email)
        } else if (error && error.message) {
          setApiError("Error: " + error);
        } else {
          setApiError("An unknown error occurred.");
        }
      }
    
    return(
        <div className="Login">
            <form>
            {apiError && <TransitionAlerts message={apiError} />}
                <h1>Catalag Online</h1>
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
            </form>
        </div>
    );
}
export default LoginPage; 