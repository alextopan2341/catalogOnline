
import React, { useState,useEffect } from 'react';
import { FaUser, FaHome, FaSignOutAlt,FaUserEdit,FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const SideMenu = () => {
  
  const navigate = useNavigate() 


  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    // Optionally, navigate to the login page or any other desired route
    navigate('/');
  };

  const handleIconClick = (index) => {
    if (iconData[index].path) {
      navigate(iconData[index].path);
    } else if (iconData[index].action) {
      iconData[index].action();
    }
  };



  let iconData = [
    { icon: <FaUser />, name: 'Register' ,path:'/register'},
    {icon:<FaUserEdit/>,name:'Edit classes',path:'/modify'},
    {icon:<FaPlus/>,name:'Add Classroom',path:'/addClass'},
    {icon : <FaSignOutAlt/>, name:'SignOut',action:handleLogout}
   
  ];

  return (
    <div className="side-menu">
      {iconData.map((item, index) => (
        <div key={item.name} className="menu-icon" onClick={() => handleIconClick(index)}>
          {item.icon}
          <div className="icon-name">{item.name}</div>
          {/* Options rendering logic can be added here if needed */}
        </div>
      ))}
    </div>
  );
};

export default SideMenu;
