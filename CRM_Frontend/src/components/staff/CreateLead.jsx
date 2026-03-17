import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateLead() {

  const navigate = useNavigate()

  const token = localStorage.getItem("token")

  const BASE_URL = "http://localhost:8000"

  const [lead, setLead] = useState({title: "", value: "", expected_closing: "", stage_id: "", status_id: "", service_id: "", customer_id: "" })

  const [stages, setStages] = useState([])
  const [statuses, setStatuses] = useState([])
  const [services, setServices] = useState([])
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    fetchMetaData()
  }, [])

  async function fetchMetaData() {

    try {

      const stageRes = await fetch(`${BASE_URL}/manager/lead/stage`, { 
        headers: {
           Authorization: `Bearer ${token}`
          }
        })

      setStages(await stageRes.json())

      const statusRes = await fetch(`${BASE_URL}/manager/lead/status`, { 
        headers: {
           Authorization: `Bearer ${token}` 
          } 
        })

      setStatuses(await statusRes.json())

      const serviceRes = await fetch(`${BASE_URL}/active-services`, {
         headers: { Authorization: `Bearer ${token}`
          } 
        })

      setServices(await serviceRes.json())

      const customerRes = await fetch(`${BASE_URL}/customers`, {
         headers: { 
            Authorization: `Bearer ${token}` 
        } 
      })

      setCustomers(await customerRes.json())

    } catch (error) {
      console.log("Error fetching dropdown data", error)
    }
  }

  function handleChange(e) {

    const { name, value } = e.target
    setLead(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {

      const res = await fetch(`${BASE_URL}/staff/lead/create`, {
        method: "POST",
        headers: {
           "Content-Type": "application/json", 
           Authorization: `Bearer ${token}`
           },
        body: JSON.stringify(lead)
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.detail || "Failed to create lead")
        return
      }

      alert(`${data.message}`)

      navigate('/staff/dashboard')

    } catch (error) {
      console.log("Error creating lead", error)
    }
  }

  return (

    <div className="container mt-4">

      <div className="mb-4">
        <h4>Create New Lead</h4>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row g-3">

              <div className="col-lg-3">
                <label className="form-label">Title</label>
                <input type="text" name="title" className="form-control" value={lead.title} onChange={handleChange} required />
              </div>

              <div className="col-lg-3">
                <label className="form-label">Value</label>
                <input type="number" name="value" className="form-control" value={lead.value} onChange={handleChange} required />
              </div>

              <div className="col-lg-3">
                <label className="form-label">Expected Closing</label>
                <input type="date" name="expected_closing" className="form-control" value={lead.expected_closing} onChange={handleChange} required />
              </div>

              <div className="col-lg-3">
                <label className="form-label">Stage</label>

                <select name="stage_id" className="form-select" value={lead.stage_id} onChange={handleChange} required>

                  <option value="">Select Stage</option>
                  
                  {stages.map(stage =>
                     <option key={stage.id} value={stage.id}>{stage.name}</option>)
                  }

                </select>
              </div>

              <div className="col-lg-3">

                <label className="form-label">Status</label>

                <select name="status_id" className="form-select" value={lead.status_id} onChange={handleChange} required>

                  <option value="">Select Status</option>

                  {statuses.map(status =>
                     <option key={status.id} value={status.id}>{status.name}</option>)
                  }
                </select>
              </div>

              <div className="col-lg-3">

                <label className="form-label">Service</label>
                <select name="service_id" className="form-select" value={lead.service_id} onChange={handleChange} required>

                  <option value="">Select Service</option>

                  {services.map(service => 
                    <option key={service.id} value={service.id}>{service.name} </option>)
                  }

                </select>
              </div>

              <div className="col-lg-3">
                <label className="form-label">Customer</label>
                <select name="customer_id" className="form-select" value={lead.customer_id} onChange={handleChange} required>

                  <option value="">Select Customer</option>

                  {customers.map(customer => 

                    <option key={customer.id} value={customer.id}>{customer.name}</option>)

                  }

                </select>
              </div>

            </div>

            <div className="mt-4">
              <button type="submit" className="btn btn-primary">Create Lead</button>
              <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/staff/dashboard')}>Cancel</button>
            </div>

          </form>

        </div>
      </div>

    </div>
  )
}

export default CreateLead