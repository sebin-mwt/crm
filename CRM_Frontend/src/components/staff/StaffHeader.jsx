import React from 'react'
import { useNavigate } from 'react-router-dom'

function StaffHeader() {

  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem("user"))

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  const firstLetter = user?.email?.charAt(0).toUpperCase()

  return (

    <div className='d-flex justify-content-between align-items-center p-3 border-bottom'>

      <h5 className='mb-0'>Welcome, {user.email}</h5>

      <div className="dropdown">

        <div  className="d-flex align-items-center gap-2" style={{cursor:"pointer"}} data-bs-toggle="dropdown">

          {/* Avatar */}
          <div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center" style={{width:"38px", height:"38px", fontWeight:"bold"}} > {firstLetter}</div>   
          <i className="bi bi-chevron-down"></i>

        </div>

        <ul className="dropdown-menu dropdown-menu-end">

          <li className="dropdown-item-text">
            <small>{user.email}</small>
          </li>

          <li><hr className="dropdown-divider"/></li>

          <li>
            <button className="dropdown-item text-danger" onClick={handleLogout}>
              Logout
            </button>
          </li>

        </ul>

      </div>

    </div>
  )
}

export default StaffHeader