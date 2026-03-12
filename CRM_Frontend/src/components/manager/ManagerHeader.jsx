import React from 'react'
import { useNavigate } from 'react-router-dom'

function ManagerHeader() {

  const nav = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    nav('/')
  }

  const username = JSON.parse(localStorage.getItem("user")) || "Manager"

  return (
    <div className='d-flex justify-content-between align-items-center p-3 border-bottom'>

      <h5>Welcome, {username.email}</h5>

      <button className='btn btn-danger btn-sm'onClick={handleLogout} >
        Logout
      </button>

    </div>
  )
}

export default ManagerHeader