import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function ProtectedRoute({ children, allowedrole }) {
    
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {

    return <Navigate to='/' replace />;

  }

  try {

    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();
    
    if (isExpired) {

      alert('Token expired, please login again to continue..');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to='/' replace />;
    }

  } catch (err) {

    alert(`Error occurred: ${err}`);
    return <Navigate to='/' replace />;

  }
 
  if (allowedrole) {

    const roles = Array.isArray(allowedrole) ? allowedrole : [allowedrole];
    if (!roles.includes(user.role)) {
      return <Navigate to='/' replace />;

    }
  }

  return children;
}

export default ProtectedRoute;
