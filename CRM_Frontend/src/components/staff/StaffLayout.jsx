import React from 'react'
import { Outlet } from 'react-router-dom'
import StaffSidebar from './StaffSidebar'
import StaffHeader from './StaffHeader'

function StaffLayout() {

  return (

    <div className='d-flex' style={{ minHeight: "100vh" }}>

      <StaffSidebar />

      <div style={{ flex: 5 }}>
        <StaffHeader />
        <div className='p-3'>
          <Outlet />
        </div>
      </div>

    </div>
  )
}

export default StaffLayout