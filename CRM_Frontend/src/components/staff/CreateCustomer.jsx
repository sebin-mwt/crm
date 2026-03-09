import React, { useState, useEffect } from 'react'

function CreateCustomer() {

  const [institution, setInstitution] = useState({ name: "", address: "", website: "", category_id: "" })
  const [contacts, setContacts] = useState([{ name: "", email: "", phone: "", position: "", department: "" }])
  const [categories, setCategories] = useState([])

  const token = localStorage.getItem("token")

  useEffect(()=>{
    fetchCategories();
  }, [])

    async function fetchCategories() {

      try {
        
        const res = await fetch("http://localhost:8000/customer/category", {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setCategories(data)

      } catch (err) {
        console.log("Error fetching categories:", err)
      }
    }

  function handleInstitutionChange(e) {

    const { name, value } = e.target
    setInstitution(prev => ({ ...prev, [name]: value }))

  }

  function handleContactChange(e, index) {

    const { name, value } = e.target
    const updatedContacts = [...contacts]
    updatedContacts[index][name] = value
    setContacts(updatedContacts)
  }

  function addContactField() {

    setContacts([...contacts, { name: "", email: "", phone: "", position: "", department: "" }])

  }

  function removeContactField(index) {

    const updatedContacts = [...contacts]
    updatedContacts.splice(index, 1)
    setContacts(updatedContacts)

  }

  async function handleSubmit(e) {

    e.preventDefault()

    const cleanedContacts = contacts.filter(c => c.name.trim() !== "")
    const payload = { ...institution, contacts: cleanedContacts }

    try {

        const res = await fetch("http://localhost:8000/staff/customer/create", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
            },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.detail || "Failed to create customer")
        return
      }

      alert(data.message)
      setInstitution({ name: "", address: "", website: "", category_id: "" })
      setContacts([{ name: "", email: "", phone: "", position: "", department: "" }])

    } catch (err) {
      console.log("Error creating customer:", err)
    }
  }

  return (

    <div className="container mt-4">

      <h3>Create Customer Institution</h3>

      <form onSubmit={handleSubmit} className="mt-3">

        {/* Institution Info */}
        <div className="row mb-3">

          <div className="col-6 col-sm-6 col-md-4">
            <label className="form-label">Name</label>
            <input type="text" name="name" className="form-control" value={institution.name} onChange={handleInstitutionChange} required />
          </div>

          <div className="col-6 col-sm-6 col-md-4">
            <label className="form-label">Address</label>
            <textarea type="text" name="address" className="form-control" value={institution.address} onChange={handleInstitutionChange} required/>
          </div>

          <div className="col-6 col-sm-6 col-md-4">
            <label className="form-label">Website</label>
            <input type="text" name="website" className="form-control" value={institution.website} onChange={handleInstitutionChange} />
          </div>

          <div className="col-6 col-sm-6 col-md-4 ">

            <label className="form-label">Category</label>
            <select name="category_id" className="form-select" value={institution.category_id} onChange={handleInstitutionChange} required>
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.category_name}</option>
              ))}
            </select>
          </div>
        </div>

        <hr />

        {/* Contacts */}

        <h5>Contacts</h5>

        {contacts.map((contact, index) => (

          <div key={index} className="border p-3 mb-2 rounded">
            <div className="row g-2">

              <div className="col-6 col-md-4 col-lg-3">
                <label className="form-label">Name</label>
                <input type="text" name="name" className="form-control" value={contact.name} onChange={(e) => handleContactChange(e, index)} required />
              </div>

              <div className="col-6 col-md-4 col-lg-3">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-control" value={contact.email} onChange={(e) => handleContactChange(e, index)} required />
              </div> 

              <div className="col-6 col-md-4 col-lg-3">
                <label className="form-label">Phone</label>
                <input type="text" name="phone" className="form-control" value={contact.phone} onChange={(e) => handleContactChange(e, index)} required />
              </div>

              <div className="col-6 col-md-4 col-lg-3">
                <label className="form-label">Position</label>
                <input type="text" name="position" className="form-control" value={contact.position} onChange={(e) => handleContactChange(e, index)} required/>
              </div>

              <div className="col-6 col-md-4 col-lg-3 mt-2">
                <label className="form-label">Department</label>
                <input type="text" name="department" className="form-control" value={contact.department} onChange={(e) => handleContactChange(e, index)} required />
              </div>

              <div className="col-6 col-md-4 col-lg-3 mt-5 text-end">

                <button type="button" className="btn btn-danger btn-sm " onClick={() => removeContactField(index)} disabled={contacts.length === 1}>
                  Remove Contact
                </button>

              </div>
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-secondary btn-sm mb-3" onClick={addContactField}>+ Add Contact</button>

        <div>
          <button type="submit" className="btn btn-primary">Create Customer</button>
        </div>

      </form>
    </div>
  )
}

export default CreateCustomer