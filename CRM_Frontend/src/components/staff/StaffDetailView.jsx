import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function StaffDetailView() {

  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [customer, setCustomer] = useState(null);
  const [categories, setCategories] = useState([]);

  const [showEditCompany, setShowEditCompany] = useState(false);
  const [showEditMember, setShowEditMember] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const [selectedMember, setSelectedMember] = useState(null);

  const [companyForm, setCompanyForm] = useState({
    name: "",
    address: "",
    website: "",
    category_id: ""
  });

  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: ""
  });

  function handleCompanyChange(e) {

    const { name, value } = e.target;
    setCompanyForm(prev => ({...prev,[name]: value}));

  }

  function handleMemberChange(e) {

    const { name, value } = e.target;

    setMemberForm(prev => ({...prev,[name]: value}));
  }


  async function getCustomerDetail() {

    try {

      const res = await fetch(`http://127.0.0.1:8000/staff/${id}/customer`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setCustomer(data);

    } catch (err) {

      console.error(err);
      alert("Error fetching customer");

    }
  }

  async function getCategories() {

    try {

      const res = await fetch(`http://127.0.0.1:8000/customer/category`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setCategories(data);

    } catch (err) {
      console.error(err);
    }
  }

  async function updateCustomer() {

    try {

      const res = await fetch(`http://127.0.0.1:8000/staff/${id}/customer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(companyForm)
      });

      if (!res.ok) throw new Error("Failed");

      setShowEditCompany(false);
      getCustomerDetail();

    } catch (err) {
      console.error(err);
    }
  }

  async function addMember() {

    try {

      const res = await fetch(`http://127.0.0.1:8000/staff/${id}/member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(memberForm)
      });

      if (!res.ok) throw new Error("Failed");

      setShowAddMember(false);

      setMemberForm({
        name: "",
        email: "",
        phone: "",
        position: "",
        department: ""
      });

      getCustomerDetail();

    } catch (err) {
      console.error(err);
    }
  }

  async function updateMember() {

    try {

      const res = await fetch(`http://127.0.0.1:8000/staff/${selectedMember.id}/member`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(memberForm)
      });

      if (!res.ok) throw new Error("Failed");

      setShowEditMember(false);
      getCustomerDetail();

    } catch (err) {
      console.error(err);
    }
  }

  async function deleteMember(memberId) {

    if (!window.confirm("Delete this member?")) return;

    try {

      const res = await fetch(`http://127.0.0.1:8000/staff/${memberId}/member`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed");

      getCustomerDetail();

    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {

    getCustomerDetail();
    getCategories();

  }, [id]);

  if (!customer) return <p>Loading customer data...</p>;

  return (

    <div className="container mt-4">

      {/* Company Card */}

      <div className="card mb-4 shadow-sm">

        <div className="card-body">

          <div className="d-flex justify-content-between">

            <div>

              <h4>{customer.name}</h4>

              <p><strong>Address:</strong> {customer.address}</p>

              <p>
                <strong>Website:</strong>{" "}
                <a href={`https://${customer.website}`} target="_blank" rel="noreferrer">
                  {customer.website}
                </a>
              </p>

              <p><strong>Category:</strong> {customer.category}</p>

            </div>

            <button className="btn btn-primary btn-sm" onClick={() => {

                setCompanyForm({name: customer.name,address: customer.address,
                  website: customer.website,category_id: customer.category_id
                });

                setShowEditCompany(true);
              }}  >
              Edit
            </button>

          </div>

        </div>

      </div>

      {/* Members Table */}

      <div className="card shadow-sm">

        <div className="card-body">

          <div className="d-flex justify-content-between mb-3">

            <h5>Contacts / Members</h5>

            <button className="btn btn-success btn-sm" onClick={() => { 
              setMemberForm({  name: "", email: "",phone: "",position: "",department: "" });
              setShowAddMember(true);
              }} >
              Add Member
            </button>

          </div>

          {customer.members.length > 0 ? (

            <table className="table table-hover">

              <thead className="table-light">

                <tr>
                  <th>Sl</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {customer.members.map((m, index) => (

                  <tr key={m.id}>

                    <td>{index + 1}</td>
                    <td>{m.name}</td>
                    <td>{m.email}</td>
                    <td>{m.phone}</td>
                    <td>{m.position}</td>
                    <td>{m.department}</td>

                    <td>

                      <button className="btn btn-outline-primary btn-sm me-2" onClick={() => {

                          setSelectedMember(m);

                          setMemberForm({
                            name: m.name,
                            email: m.email,
                            phone: m.phone,
                            position: m.position,
                            department: m.department
                          });

                          setShowEditMember(true);
                        }}
                      >
                        Edit
                      </button>

                      <button className="btn btn-outline-danger btn-sm" onClick={() => deleteMember(m.id)}>
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          ) : (

            <p className="text-center">No members found</p>

          )}

        </div>

      </div>

      {/* Add Member Modal */}

      {showAddMember && (

        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>

          <div className="modal-dialog">

            <div className="modal-content">

              <div className="modal-header">
                <h5>Add Member</h5>
                <button className="btn-close" onClick={() => setShowAddMember(false)}></button>
              </div>

              <div className="modal-body">

                <input name="name" className="form-control mb-2" placeholder="Name" value={memberForm.name} onChange={handleMemberChange}/>
                <input name="email" className="form-control mb-2" placeholder="Email" value={memberForm.email} onChange={handleMemberChange}/>
                <input name="phone" className="form-control mb-2" placeholder="Phone" value={memberForm.phone} onChange={handleMemberChange}/>
                <input name="position" className="form-control mb-2" placeholder="Position" value={memberForm.position} onChange={handleMemberChange}/>
                <input name="department" className="form-control mb-2" placeholder="Department" value={memberForm.department} onChange={handleMemberChange}/>

              </div>

              <div className="modal-footer">

                <button className="btn btn-secondary" onClick={() => setShowAddMember(false)}>Cancel</button>
                <button className="btn btn-success" onClick={addMember}>Save</button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* Edit Member Modal */}

      {showEditMember && (

        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>

          <div className="modal-dialog">

            <div className="modal-content">

              <div className="modal-header">
                <h5>Edit Member</h5>
                <button className="btn-close" onClick={() => setShowEditMember(false)}></button>
              </div>

              <div className="modal-body">

                <input name="name" className="form-control mb-2" value={memberForm.name} onChange={handleMemberChange}/>
                <input name="email" className="form-control mb-2" value={memberForm.email} onChange={handleMemberChange}/>
                <input name="phone" className="form-control mb-2" value={memberForm.phone} onChange={handleMemberChange}/>
                <input name="position" className="form-control mb-2" value={memberForm.position} onChange={handleMemberChange}/>
                <input name="department" className="form-control mb-2" value={memberForm.department} onChange={handleMemberChange}/>

              </div>

              <div className="modal-footer">

                <button className="btn btn-secondary" onClick={() => { setShowEditMember(false);
                setMemberForm({name: "",email: "",phone: "",position: "",department: ""});}} >
                  Cancel
                </button>

                <button className="btn btn-primary" onClick={updateMember}>Update</button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* Edit Company Modal */}

      {showEditCompany && (

        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>

          <div className="modal-dialog">

            <div className="modal-content">

              <div className="modal-header">
                <h5>Edit Company</h5>
                <button className="btn-close" onClick={() => setShowEditCompany(false)}></button>
              </div>

              <div className="modal-body">

                <input name="name" className="form-control mb-2" value={companyForm.name} onChange={handleCompanyChange}/>
                <input name="address" className="form-control mb-2" value={companyForm.address} onChange={handleCompanyChange}/>
                <input name="website" className="form-control mb-2" value={companyForm.website} onChange={handleCompanyChange}/>

                <select name="category_id" className="form-select" value={companyForm.category_id} onChange={handleCompanyChange}>

                  <option value="">Select Category</option>

                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.category_name}
                    </option>
                  ))}

                </select>

              </div>

              <div className="modal-footer">

                <button className="btn btn-secondary" onClick={() => setShowEditCompany(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={updateCustomer}>Update</button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default StaffDetailView;