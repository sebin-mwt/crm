import React from 'react'
import { NavLink } from 'react-router-dom'

function ManagerSidebar() {
  return (
    <div
      className="d-flex flex-column p-3"
      style={{
        width: "240px",
        background: "#111827",
        minHeight: "100vh"
      }}
    >

      <div className="text-center mb-4">
        <h4 className="text-white m-0">
          <i className="fa-solid fa-user-tie me-2"></i>
          Manager Panel
        </h4>
      </div>

      <NavLink to="/manager/dashboard" className={({ isActive }) => "sidebar-link " + (isActive ? "active-link" : "")}>
        <i className="fa-solid fa-chart-pie me-2"></i> Dashboard
      </NavLink>

      <NavLink to="/manager/customers" className={({ isActive }) =>"sidebar-link " + (isActive ? "active-link" : "")}>
        <i className="fa-solid fa-building me-2"></i>  All Leads
      </NavLink>

      {/* <NavLink to="/manager/staff" className={({ isActive }) =>
        "sidebar-link " + (isActive ? "active-link" : "")
      }>
        <i className="fa-solid fa-users me-2"></i>
        Staff Management
      </NavLink> */}

       <NavLink to="/manager/configuration" className="sidebar-link">
        <i className="fa-solid fa-gear me-2"></i>Configuration
      </NavLink>

    </div>
  )
}

export default ManagerSidebar