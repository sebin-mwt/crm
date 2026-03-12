import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DocumentsTab from "../staff/tabs/DocumentsTab";
import HistoryTab from "../staff/tabs/HistoryTab";

function OwnerLeadView() {

  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [lead, setLead] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("documents");

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {

    try {

      const res = await fetch(`http://127.0.0.1:8000/management/${id}/lead`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch lead");

      const data = await res.json();
      setLead(data);

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

        <h3 className="mb-2">
          {lead.title} - {lead.institution?.name}
        </h3>

        <hr />

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
              {new Date(lead.expected_closing).toLocaleDateString("en-GB", { timeZone: "UTC" })}
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

          <div className="col-md-2 col-sm-4">
            <strong>Raised By</strong>
            <div>{lead.staff?.name}</div>
          </div>

        </div>

      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">

        {["documents", "history"].map((tab) => (

          <li key={tab} className="nav-item">

            <button className={`nav-link ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)} >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>

          </li>

        ))}

      </ul>

      {/* Tab Content */}

      <div className="card">

        <div className="card-body">

          {activeTab === "documents" && (
            <DocumentsTab leadId={id} token={token} readOnl basePath="management"y />
          )}

          {activeTab === "history" && (
            <HistoryTab leadId={id} token={token} basePath="management" />
          )}
          
        </div>

      </div>

    </div>

  );
}

export default OwnerLeadView;