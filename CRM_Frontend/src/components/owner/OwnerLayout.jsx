import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import OwnerSidebar from "./OwnerSidebar";
import { NotificationContext } from "./NotificationContext";

function OwnerLayout() {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { notifications } = useContext(NotificationContext)

  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchNotifications = async () => {

    let res = await fetch("http://127.0.0.1:8000/management/notifications", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    let data = await res.json();

  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const goToAssignPage = () => {
    setShowDropdown(false);
    navigate("/owner/assign-manager");
  };

  return (
    <div className="d-flex">

      <OwnerSidebar />

      <div style={{ flex: 1 }}>

        <div className="d-flex justify-content-end align-items-center p-3 shadow-sm">

          {/* Notification */}
          <div className="position-relative me-4">

            <i className="fa-solid fa-bell fs-5" style={{ cursor: "pointer" }} onClick={() => setShowDropdown(!showDropdown)} ></i>

            {notifications.unassigned_staff_count > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {notifications.unassigned_staff_count}
              </span>
            )}

            {showDropdown && (
              <div className="position-absolute bg-white border shadow p-3" style={{ right: 0, top: "30px", minWidth: "250px", zIndex: 100 }} >

                <h6 className="mb-2">Notifications</h6>

                {notifications.unassigned_staff_count > 0 ? (
                  
                  <div className="p-2 border rounded" style={{ cursor: "pointer" }} onClick={goToAssignPage}>

                    {notifications.unassigned_staff_count} staff members are not assigned to managers.
                    <br />
                    <small className="text-primary">Click to assign manager</small>

                  </div>
                ) : (
                  <p className="text-muted mb-0">No notifications</p>
                )}

              </div>
            )}

          </div>

          {/* Logout */}
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout} >
            Logout
          </button>

        </div>

        <div className="p-3">
          <Outlet />
        </div>

      </div>

    </div>
  );
}

export default OwnerLayout;