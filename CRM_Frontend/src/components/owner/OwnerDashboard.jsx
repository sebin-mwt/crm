import React from 'react'

function OwnerDashboard() {

  // Demo stats
  const stats = {
    totalLeads: 120,
    totalManagers: 5,
    totalStaff: 18,
    unassignedStaff: 3
  }

  return (
    <div>

      <h3 className="mb-4">Company Overview</h3>

      <div className="row">

        <div className="col-md-3 mb-4">
          <div className="card shadow-sm p-3 text-center">
            <h6>Total Leads</h6>
            <h3>{stats.totalLeads}</h3>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card shadow-sm p-3 text-center">
            <h6>Total Managers</h6>
            <h3>{stats.totalManagers}</h3>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card shadow-sm p-3 text-center">
            <h6>Total Staff</h6>
            <h3>{stats.totalStaff}</h3>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card shadow-sm p-3 text-center">
            <h6>Unassigned Staff</h6>
            <h3 className="text-danger">{stats.unassignedStaff}</h3>
          </div>
        </div>

      </div>

    </div>
  )
}

export default OwnerDashboard