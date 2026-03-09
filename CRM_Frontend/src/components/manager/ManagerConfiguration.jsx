import React from 'react'
import { Link } from 'react-router-dom'

function ManagerConfiguration() {

  const configItems = [
    { name: "Customer Categories", path: "/manager/categories", icon: "fa-tags" },
    { name: "Lead Stages/Status", path: "/manager/stages", icon: "fa-layer-group" },
    { name: "Services", path: "/manager/services", icon: "fa-briefcase" }
  ]

  return (
    
    <div className="container mt-4">

      <h3 className="mb-4">Configuration Settings</h3>

      <div className="row">
        
        {configItems.map((item, index) => (
          <div key={index} className="col-md-3 mb-4">
            <Link to={item.path} className="text-decoration-none">
              <div className="card shadow-sm text-center p-4">
                <i className={`fa-solid ${item.icon} fa-2x mb-3`}></i>
                <h6>{item.name}</h6>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManagerConfiguration