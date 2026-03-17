import React, { useEffect, useState } from "react";
import ManagerLeadsTable from "./tables/ManagerLeadsTable";

function ManagerCustomersPage() {

  const [leads, setLeads] = useState([]);
  const token = localStorage.getItem("token");

  const fetchLeads = async () => {
    try {

      const res = await fetch("http://127.0.0.1:8000/manager/all-leads", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Failed to fetch leads");
        return;
      }

      setLeads(data.all_leads || []);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Status color mapping
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

  return (

    <div className="container">

      <h4 className="mb-3">Team Leads</h4>

      <ManagerLeadsTable leads={leads} handleStatusColor={handleStatusColor}/>

    </div>

  );
}

export default ManagerCustomersPage;