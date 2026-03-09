import React from 'react'
import { NavLink } from 'react-router-dom'
import "./sidebar.css"
function StaffSidebar() {
  return (

    <div className="d-flex flex-column p-3" style={{ width: "230px", background: "#25354b", minHeight: "100vh"}}>

      <div className="text-center mb-4">
        <h4 className="text-white m-0">
          <i className="fa-solid fa-building me-2"></i>CRM
        </h4>
      </div>

      <NavLink to="/staff/dashboard" className={({ isActive }) =>`sidebar-link ${isActive ? "active-link" : ""}`}>
        
        <i className="fa-solid fa-chart-line me-2"></i> Dashboard
      </NavLink>

      <NavLink to="/staff/customers" className={({ isActive }) =>`sidebar-link ${isActive ? "active-link" : ""}`}>
        <i className="fa-solid fa-users me-2"></i> Customers
      </NavLink>

      <NavLink to="/staff/activities" className={({ isActive }) =>`sidebar-link ${isActive ? "active-link" : ""}`} >
        <i className="fa-solid fa-clipboard-list me-2"></i>My Activities
      </NavLink>

    </div>
  )
}

export default StaffSidebar