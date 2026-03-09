import React from 'react'
import { NavLink } from 'react-router-dom'

function OwnerSidebar() {

    const user = JSON.parse(localStorage.getItem("user"))

  return (
    <div className="d-flex flex-column p-3"style={{ width: "250px", background: "#0f172a", minHeight: "100vh" }}>

      <h4 className="text-white text-center mb-4">
        <i className="fa-solid fa-crown me-2"></i>
        {user.email}
      </h4>

      <NavLink to="/owner/dashboard" className="sidebar-link">
        <i className="fa-solid fa-chart-line me-2"></i>
        Dashboard
      </NavLink>

      <NavLink to="/owner/leads" className="sidebar-link">
        <i className="fa-solid fa-list-check me-2"></i>
        All Leads
      </NavLink>

      <NavLink to="/owner/managers" className="sidebar-link">
        <i className="fa-solid fa-user-tie me-2"></i>
        Managers
      </NavLink>

      <NavLink to="/owner/staff" className="sidebar-link">
        <i className="fa-solid fa-users me-2"></i>
        Staff
      </NavLink>

      <NavLink to="/owner/assign" className="sidebar-link">
        <i className="fa-solid fa-user-gear me-2"></i>
        Assign Manager
      </NavLink>

    </div>
  )
}

export default OwnerSidebar