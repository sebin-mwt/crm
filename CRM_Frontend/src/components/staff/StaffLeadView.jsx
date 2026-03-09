import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function StaffLeadView() {

  const { id } = useParams();
  const token = localStorage.getItem('token')
  const [lead, setLead] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("activities");

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {

    try {

      const response = await fetch(`http://127.0.0.1:8000/staff/${id}/lead`,{
        headers:{
            Authorization : `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch lead");
      }

      const data = await response.json();
      setLead(data);

    } catch (err) {
      setError(err.message);
    }

  };

  function handleStatusColor(sts){

    const colors ={
      Won : 'bg-success',
      Lost : 'bg-danger',
      "On Hold" : 'bg-warning',
      "Closed/Inactive" : "bg-danger",
      Contacted : "bg-info"
    }

    return colors[sts] || 'bg-primary'
  }

  if (error) {
    return <div className="container mt-4 text-danger">{error}</div>;
  }

  if (!lead) {
    return <div className="container mt-4">Lead not found</div>;
  }

  return (
    <div className="container mt-4">

      {/* Lead Header */}

      <div className="mb-4">
        <div>

        <div className="d-flex justify-content-between align-items-center">

            <h3 className="mb-1">
                {lead.title} - {lead.institution?.name}
            </h3>

        <div className="d-flex gap-2 mb-2">

            <button className="btn btn-sm btn-secondary">
            Change Status
            </button>

            <button className="btn btn-sm btn-primary">
            Add Activity
            </button>

        </div>

        </div>

        <hr />
          <div className="row mt-3">

            <div className="col-md-2">
              <strong>Service</strong>
              <div>{lead.service?.name}</div>
            </div>

            <div className="col-md-2">
              <strong>Value</strong>
              <div>₹ {lead.value}</div>
            </div>

            <div className="col-md-2">
              <strong>Stage</strong>
              <div>
                <span className="badge bg-secondary">
                  {lead.stage?.name}
                </span>
              </div>
            </div>

            <div className="col-md-2">
              <strong>Status</strong>

              <div>
                <span className={`badge ${handleStatusColor(lead.status?.name)}`}>
                  {lead.status?.name}
                </span>
              </div>

            </div>

            <div className="col-md-2">
              <strong>Expected Closing</strong>
              <div>
                {new Date(lead.expected_closing).toLocaleDateString("en-GB",{timeZone :"utc"})}
              </div>
            </div>


          </div>

        </div>
      </div>


      {/* Tabs */}

      <ul className="nav nav-tabs mb-3">

        <li className="nav-item">
          <button className={`nav-link ${activeTab === "activities" ? "active" : ""}`} onClick={() => setActiveTab("activities")}>
            Activities
          </button>
        </li>

        <li className="nav-item">
          <button className={`nav-link ${activeTab === "documents" ? "active" : ""}`} onClick={() => setActiveTab("documents")}>
            Documents
          </button>
        </li>   

        <li className="nav-item">
          <button className={`nav-link ${activeTab === "history" ? "active" : ""}`} onClick={() => setActiveTab("history")}>
            Status History
          </button>
        </li>

      </ul>


      {/* Content Layout 3:1 */}

      <div className="row">

  {/* Left Side Content */}

  <div className="col-md-8">

    <div className="card">
      <div className="card-body">

        {activeTab === "activities" && (
          <div>

            {lead.activities?.length === 0 && <p>No activities</p>}

            {lead.activities?.map(activity => (
              <div key={activity.id} className="border-bottom pb-2 mb-2">
                <div>{activity.description}</div>
                <small className="text-muted">{activity.user?.name}</small>
              </div>
            ))}

          </div>
        )}


        {activeTab === "history" && (
          <div>

            {lead.history?.length === 0 && <p>No history</p>}

            {lead.history?.map(item => (
              <div key={item.id} className="border-bottom pb-2 mb-2">
                <div>{item.old_status?.name} → {item.new_status?.name}</div>
                <small>{item.changed_at}</small>
              </div>
            ))}

          </div>
        )}


        {activeTab === "documents" && (
          <div>

            {lead.documents?.length === 0 && <p>No documents</p>}

            {lead.documents?.map(doc => (
              <div key={doc.id} className="border-bottom pb-2 mb-2">
                <a href={doc.file_url} target="_blank" rel="noreferrer">{doc.name}</a>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>

  </div>


  {/* Quick Actions */}

    <div className="col-md-4">

    <div className="card">

        <div className="card-body">

        <h6 className="mb-3">Quick Actions</h6>

        <div className="row text-center">

        <div className="col-6 col-md-3 mb-3">
            <button className="btn btn-light border rounded-circle" style={{width:"55px",height:"55px"}}>
            <i className="fa-solid fa-phone"></i>
            </button>
            <div className="small mt-1 text-nowrap">Log Call</div>
        </div>

        <div className="col-6 col-md-3 mb-3">
            <button className="btn btn-light border rounded-circle" style={{width:"55px",height:"55px"}}>
            <i className="fa-solid fa-calendar"></i>
            </button>
            <div className="small mt-1 text-nowrap">Meeting</div>
        </div>

        <div className="col-6 col-md-3 mb-3">
            <button className="btn btn-light border rounded-circle" style={{width:"55px",height:"55px"}}>
            <i className="fa-solid fa-comment"></i>
            </button>
            <div className="small mt-1 text-nowrap">Comment</div>
        </div>

        <div className="col-6 col-md-3 mb-3">
            <button className="btn btn-light border rounded-circle" style={{width:"55px",height:"55px"}}>
            <i className="fa-solid fa-upload"></i>
            </button>
            <div className="small mt-1 text-nowrap">Upload</div>
        </div>

        </div>

        </div>
    </div>

</div>

</div>
    </div>
  );

}

export default StaffLeadView;