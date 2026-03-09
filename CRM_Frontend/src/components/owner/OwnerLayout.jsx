import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import OwnerSidebar from './OwnerSidebar'

function OwnerLayout() {

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  const unassignedStaff = 3  

  return (

    <div className="d-flex">

      <OwnerSidebar />

      <div style={{ flex: 1 }}>


        <div className="d-flex justify-content-end align-items-center p-3 shadow-sm">

          {/* Notification */}
          <div className="position-relative me-4">
            <i className="fa-solid fa-bell fs-5"></i>

            {unassignedStaff > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {unassignedStaff}
              </span>
            )}
          </div>

          {/* Logout */}
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >

            Logout
          </button>

        </div>

        {/* PAGE CONTENT */}
        <div className="p-4">
          <Outlet />
        </div>

      </div>
    </div>
  )
}

export default OwnerLayout