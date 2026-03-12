import React, { useState, useEffect } from "react";

function StaffManagerTable({ staffs, managers, onAssign, title }) {

  const [selectedManagers, setSelectedManagers] = useState({});

  useEffect(()=>{

    const initial = {}

    staffs.forEach(staff=>{
      if(staff.manager_id){
        initial[staff.id] = staff.manager_id
      }
    })

    setSelectedManagers(initial)

  },[staffs])

  const handleSelect = (staffId , managerId)=>{
    setSelectedManagers({
      ...selectedManagers,
      [staffId] : managerId
    })
  }

  return (

    <div className="mb-4">

      <h5 className="mb-3">{title}</h5>

      <table className="table table-bordered">

        <thead className="table-light">
          <tr>
            <th>Staff</th>
            <th>Email</th>
            <th>Select Manager</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {staffs.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">No Data</td>
            </tr>
          )}

          {staffs.map((staff)=>(

            <tr key={staff.id}>

              <td>{staff.name}</td>

              <td>{staff.email}</td>

              <td>

                <select className="form-select" value={selectedManagers[staff.id] || ""} onChange={(e)=>handleSelect(staff.id , e.target.value)}>

                  <option value="">Select Manager</option>

                  {managers.map((m)=>(
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}

                </select>

              </td>

              <td>

                <button className="btn btn-sm btn-primary" onClick={()=>onAssign(staff.id , selectedManagers[staff.id])}>
                  {staff.is_assigned ? "Update" : "Assign"}
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  )
}

export default StaffManagerTable