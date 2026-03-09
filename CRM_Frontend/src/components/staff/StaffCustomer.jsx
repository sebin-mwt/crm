import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function StaffCustomers() {

  const [customers, setCustomers] = useState([])
  const token = localStorage.getItem('token')

  async function getCustomers() {

    try {

      const res = await fetch("http://127.0.0.1:8000/customers", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (!res.ok) {
        alert("Failed to fetch customers")
        return
      }

      setCustomers(data)

    } catch (err) {
      console.log(err)
      alert("Server error")
    }
  }

  useEffect(() => {
    getCustomers()
  }, [])

  return (
    <div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Customers</h4>

        <Link to={"/staff/create/customer"} className="btn btn-primary">
          <i className="fa-solid fa-plus me-2"></i>
          Create New Customer
        </Link>
      </div>

      <div className="card shadow-sm">

        <div className="card-body">

          <table className="table table-hover align-middle">

            <thead className="table-light">
              <tr>
                <th>Sl</th>
                <th>Institution Name</th>
                <th>Website</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {customers.length > 0 ? (

                customers.map((cust, index) => (
                  <tr key={cust.id}>
                    <td>{index + 1}</td>
                    <td>{cust.name}</td>
                    <td>{cust.website}</td>
                    <td>{new Date(cust.created_at).toLocaleDateString('en-GB')}</td>
                    <td>
                      <Link to={`/staff/${cust.id}/customer`}>View</Link>
                    </td>
                  </tr>
                ))

              ) : (

                <tr>
                  <td colSpan="5" className="text-center">
                    No Customers Found
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  )
}

export default StaffCustomers