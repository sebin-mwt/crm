import React, { useEffect, useState } from "react";
import StaffManagerTable from "./StaffManagerTable";
import { useContext } from "react"
import { NotificationContext } from "./NotificationContext";
function AssignManager() {

  const [staffs, setStaffs] = useState([]);
  const [managers, setManagers] = useState([]);

  const { fetchNotifications } = useContext(NotificationContext)

  const token = localStorage.getItem("token");

  async function fetchUsers() {

    const res = await fetch("http://127.0.0.1:8000/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      setStaffs(data.staffs);
      setManagers(data.managers);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

 const handleAssign = async (staffId, managerId) => {

  if (!managerId) {
    alert("Select a manager");
    return;
  }

  const res = await fetch(
    "http://127.0.0.1:8000/management/update-manager",{
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        staff_id: staffId,
        manager_id: managerId
      })
    }
  );

  const data = await res.json();

  if (res.ok) {

    alert(data.message);
    fetchUsers();
    fetchNotifications();

  } else {
    alert(data.detail);
  }
};

  const unassigned = staffs.filter(s => !s.is_assigned);
  const assigned = staffs.filter(s => s.is_assigned);

  return (

    <div className="container">

      <h4 className="mb-4">Manager Assignment</h4>

      <StaffManagerTable title="Unassigned Staff" staffs={unassigned}  managers={managers} onAssign={handleAssign}/>

      <StaffManagerTable title="Assigned Staff" staffs={assigned} managers={managers} onAssign={handleAssign} />

    </div>
  );
}

export default AssignManager;