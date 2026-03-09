import React from 'react'
import { useNavigate } from 'react-router-dom'

function StaffHeader() {

  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem("user"))

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div className='d-flex justify-content-between align-items-center p-3 border-bottom'>

      <h5>Welcome,{user.email}</h5>

      <button className='btn btn-danger btn-sm' onClick={handleLogout}> Logout</button>

    </div>
  )
}

export default StaffHeader