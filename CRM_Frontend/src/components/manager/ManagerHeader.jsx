import React from 'react';
import { useNavigate } from 'react-router-dom';

function ManagerHeader() {
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    nav('/');
  };

  const user = JSON.parse(localStorage.getItem("user")) || { email: "Manager" };

  return (
    <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
      <h5 className="mb-0">Welcome, {user.email}</h5>
      <button className="btn btn-danger btn-sm" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default ManagerHeader;