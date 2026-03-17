import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuickActions from "./QuickActions";
import ActivitiesTab from "./tabs/ActivitiesTab";
import DocumentsTab from "./tabs/DocumentsTab";
import HistoryTab from "./tabs/HistoryTab";
import CommentsTab from "./tabs/CommentsTab";

function StaffLeadView() {

  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [lead, setLead] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("activities");

  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    
    try {

      const res = await fetch(`http://127.0.0.1:8000/staff/${id}/lead`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      });

      if (!res.ok) throw new Error("Failed to fetch lead");

      const data = await res.json();

      setLead(data);
      setSelectedStatus(data.status?.id || "");

      fetchStatuses();

    } catch (err) {
      setError(err.message);
    }
  };

  const fetchStatuses = async () => {

    try {

      const res = await fetch(`http://127.0.0.1:8000/manager/lead/status`, {
        headers: {
           Authorization: `Bearer ${token}`
          },
      });

      if (!res.ok) throw new Error("Failed to fetch statuses");

      const data = await res.json();
      setStatuses(data);

    } catch (err) {

      console.error("Error fetching statuses:", err);

    }
  };

  const handleChangeStatus = async () => {

    if (!selectedStatus) return;

    if (selectedStatus === lead.status?.id)
      return alert("Current status is same");

    try {

      const res = await fetch(`http://127.0.0.1:8000/staff/${id}/status-change`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          updated_status_id: selectedStatus,
        }), 
      });

      if (!res.ok) throw new Error("Failed to update status");

      fetchLead();

    } catch (err) {

      setError(err.message);

    } 
  };

  const handleStatusColor = (sts) => {

    const colors = {
      Won: "bg-success",
      Lost: "bg-danger",
      "On Hold": "bg-warning",
      "Closed/Inactive": "bg-danger",
      Contacted: "bg-info",
    };

    return colors[sts] || "bg-primary";
  };

  if (error) return <div className="container mt-4 text-danger">{error}</div>;
  if (!lead) return <div className="container mt-4">Loading lead info...</div>;

  return (

    <div className="container mt-4">

      {/* Lead Header */}
      <div className="mb-4">

        <div className="d-flex justify-content-between align-items-center">

          <h3 className="mb-1">
            {lead.title} - {lead.institution?.name}
          </h3>

          <div className="d-flex gap-2">

            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} >
              <option value="">Select Status</option>

              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}

            </select>

            <button className="btn btn-sm btn-secondary" onClick={handleChangeStatus}>
              Change Status
            </button>

          </div>

        </div>

        <hr />

        {/* Lead Info */}
        <div className="row mt-3">

          <div className="col-md-2 col-sm-4">
            <strong>Service</strong>
            <div>{lead.service?.name}</div>
          </div>

          <div className="col-md-2 col-sm-4">
            <strong>Value</strong>
            <div>₹ {lead.value}</div>
          </div>

          <div className="col-md-2 col-sm-4">
            <strong>Expected Closing</strong>
            <div>
              {new Date(lead.expected_closing).toLocaleDateString("en-GB", {
                timeZone: "UTC",
              })}
            </div>
          </div>

          <div className="col-md-2 col-sm-4">
            <strong>Stage</strong>
            <div>
              <span className="badge bg-secondary">
                {lead.stage?.name}
              </span>
            </div>
          </div>

          <div className="col-md-2 col-sm-4">
            <strong>Status</strong>
            <div>
              <span className={`badge ${handleStatusColor(lead.status?.name)}`}>
                {lead.status?.name}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">

        {["activities", "documents", "history", "comments"].map((tab) => (

          <li key={tab} className="nav-item">

            <button className={`nav-link ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)} >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>

          </li>

        ))}

      </ul>

      {/* Tab Content */}
      <div className="row">

        <div className="col-md-8">

          <div className="card">

            <div className="card-body" >

              {activeTab === "activities" && (
                <ActivitiesTab leadId={id} token={token} />
              )}

              {activeTab === "documents" && (
                <DocumentsTab leadId={id} token={token} />
              )}

              {activeTab === "history" && (
                <HistoryTab leadId={id} token={token} />
              )}

              {activeTab === "comments" && (
                <CommentsTab leadId={id} token={token} />
              )}

            </div>

          </div>

        </div>

        {/* Quick Actions */}
        <div className="col-md-4">
          <QuickActions leadId={id} setActiveTab ={setActiveTab} />
        </div>

      </div>

    </div>

  );
}

export default StaffLeadView;