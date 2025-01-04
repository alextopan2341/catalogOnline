import React, { useEffect, useState } from 'react';
import { getUser } from '../utils/LoginCalls';
import { useNavigate } from "react-router-dom";
const MainPage = () =>{
    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        let fromMemeory = null;
            getUser().then((response)=>{
                console.log(response)
                localStorage.setItem('user',response);
                setUser(response);
                setLoading(false)
            })
            .catch(error=>{
                console.log(error)
                navigate("/")
            })
        //}
    },[navigate])

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <table>
                <tbody>
                    {user ? (
                        <tr>
                            <td>{user.fullName}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                        </tr>
                    ) : (
                        <tr>
                            <td colSpan="3">No user data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default MainPage;