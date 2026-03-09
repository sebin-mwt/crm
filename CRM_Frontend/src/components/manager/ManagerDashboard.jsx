import React from 'react'

function ManagerDashboard() {

  const stats = [
    { title: "Total Leads", value: 45 },
    { title: "Active Customers", value: 18 },
    { title: "Total Staff", value: 6 },
    { title: "Revenue (Demo)", value: "₹2,50,000" }
  ]

  return (
    <div>

      <h4 className="mb-4">Manager Dashboard</h4>

      <div className="row">

        {stats.map((item, index) => (
          <div className="col-md-3 mb-3" key={index}>
            <div className="card shadow-sm text-center p-3">
              <h6 className="text-muted">{item.title}</h6>
              <h4>{item.value}</h4>
            </div>
          </div>
        ))}

      </div>

    </div>
  )
}

export default ManagerDashboard