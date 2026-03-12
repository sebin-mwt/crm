import React , { useEffect , useState } from 'react'

function AllStaff() {

  const [employees , setEmployees] = useState([])

  const token = localStorage.getItem("token")

  async function fetchEmployees(){

    let res = await fetch("http://127.0.0.1:8000/management/all-staff",{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })

    let data = await res.json()

    if(res.ok){
      setEmployees(data.employees)
    }

  }

  useEffect(()=>{
    fetchEmployees()
  },[])

  function handleRoleColor(role){

    const colors = {
      manager : "bg-info",
      staff : "bg-primary",
      management : "bg-dark"
    }

    return colors[role] || "bg-secondary"
  }

  return (

    <div className="container">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Company Employees</h4>
      </div>

      <table className="table table-bordered table-hover">

        <thead className="table-light">

          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Total Leads Raised</th>
            <th>Status</th>
          </tr>

        </thead>

        <tbody>

          {employees.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">No Employees Found</td>
            </tr>
          )}

          {employees.map((emp)=>(
            <tr key={emp.id} className='text-center'>

              <td>{emp.id}</td>

              <td>{emp.name}</td>

              <td>
                <span className={`badge ${handleRoleColor(emp.role)}`}>
                  {emp.role}
                </span>
              </td>

              <td>
                <h6 className="">
                  {emp.total_leads}
                </h6>
              </td>

              <td>
                {emp.is_active 
                  ? <span className="badge bg-success">Active</span>
                  : <span className="badge bg-danger">Inactive</span>
                }
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>

  )
}

export default AllStaff