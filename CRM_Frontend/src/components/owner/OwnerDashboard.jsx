import React, { useState, useEffect } from "react";
import CountCard from "../staff/CountCard";
import LeadsTable from "../staff/LeadsTable";
import TotalRevenueCard from "../staff/TotalRevenueCard";
import LeadCountsGraph from "../staff/LeadCountsGraph";
import RevenueChart from "./RevenueChart"

function OwnerDashboard() {

  const [leadData, setLeadData] = useState([]);
  const [ldCount, setldCount] = useState({});

  const token = localStorage.getItem("token");

  async function getLeads() {

    let res = await fetch("http://127.0.0.1:8000/management/all-leads", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let data = await res.json();

    if (!res.ok) {
      alert("Failure in response");
    }

    setLeadData(data.all_leads);

    setldCount({
      open_ld: data.ld_counts.open_ld,
      in_prog: data.ld_counts.in_prog,
      won_ld: data.ld_counts.won_ld,
      lost_ld: data.ld_counts.lost_ld,
    });
  }

  const totalRevenue = leadData.filter((ld) => ld.stage === "Post-Sales").reduce((sum, ld) => sum + ld.value, 0);

  function handleStatusColor(sts) {
    const colors = {
      Won: "bg-success",
      Lost: "bg-danger",
      "On Hold": "bg-warning",
      "Closed/Inactive": "bg-danger",
      Contacted: "bg-info",
    };

    return colors[sts] || "bg-primary";
  }

  useEffect(() => {
    getLeads();
  }, []);

  return (
    <div>

      <h4 className="mb-3">Company Leads Overview</h4>

      <div className="row">

        {[
          {
            title: "Open Leads",
            count: ldCount.open_ld,
            icon: "fa-solid fa-suitcase",
            color: "rgb(86, 61, 246)",
          },
          {
            title: "In Progress",
            count: ldCount.in_prog,
            icon: "fa-solid fa-suitcase",
            color: "rgb(209, 215, 27)",
          },
          {
            title: "Won Leads",
            count: ldCount.won_ld,
            icon: "fa-solid fa-shield-heart",
            color: "rgb(10, 152, 110)",
          },
          {
            title: "Lost Leads",
            count: ldCount.lost_ld,
            icon: "fa-solid fa-heart-crack",
            color: "rgb(249, 65, 65)",
          },
        ].map((item, idx) => (
          <CountCard key={idx} title={item.title} count={item.count} iconClass={item.icon} color={item.color} />
        ))}

        {/* <TotalRevenueCard total={totalRevenue} /> */}

      </div>

      <hr />

      <div>
        <h4>
          <u>All Leads</u>
        </h4>

        <LeadsTable leads={leadData} handleStatusColor={handleStatusColor} basePath="/owner" />
      </div>

      <hr />

     <div className="row mt-4 justify-content-center align-items-center">

      <div className="col-md-4">
       <RevenueChart leads={leadData}/>
      </div>  

      <div className="col-md-4 ">
        <LeadCountsGraph counts={ldCount}/>
      </div>

    </div>

    </div>
  );
}

export default OwnerDashboard;