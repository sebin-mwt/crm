import React, { useEffect, useState } from "react";
import CountCard from "../staff/CountCard";
import StatusBarChart from "./StatusBarChart";
import RecentLeadsCard from "./RecentLeadsCard";

function ManagerDashboard() {

  const [leadData, setLeadData] = useState([]);
  const [ldCount, setLdCount] = useState({});
  const token = localStorage.getItem("token");

  // Fetch manager leads
  const getLeads = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/manager/all-leads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        alert("Failed to fetch leads");
        return;
      }

      setLeadData(data.all_leads);

      setLdCount({
        open_ld: data.ld_counts.open_ld,
        in_prog: data.ld_counts.in_prog,
        won_ld: data.ld_counts.won_ld,
        lost_ld: data.ld_counts.lost_ld,
      });

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getLeads();
  }, []);

  // Calculate total revenue (Post-Sales / Won)
  const totalRevenue = leadData
    .filter(ld => ld.stage === "Post-Sales")
    .reduce((sum, ld) => sum + (ld.value || 0), 0);

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

      <h4 className="mb-3">Manager Leads Overview</h4>

      <div className="row mb-3">

        {[
          { title: "Open Leads", count: ldCount.open_ld, icon: "fa-solid fa-suitcase", color: "rgb(86, 61, 246)" },
          { title: "In Progress", count: ldCount.in_prog, icon: "fa-solid fa-suitcase", color: "rgb(209, 215, 27)" },
          { title: "Won Leads", count: ldCount.won_ld, icon: "fa-solid fa-shield-heart", color: "rgb(10, 152, 110)" },
          { title: "Lost Leads", count: ldCount.lost_ld, icon: "fa-solid fa-heart-crack", color: "rgb(249, 65, 65)" }
        ].map((item, idx) => (
          <CountCard key={idx} title={item.title} count={item.count} iconClass={item.icon} color={item.color} />
        ))}

      </div>

      <hr />

      <div className="row mt-4">
        <div className="col-md-7">
          <StatusBarChart leads={leadData} />
        </div>

        <div className="col-md-5">
          <RecentLeadsCard leads={leadData} handleStatusColor={handleStatusColor} />
        </div>
      </div>  

    </div>
  );
}

export default ManagerDashboard;