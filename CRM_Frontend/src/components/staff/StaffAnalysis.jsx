import React, { useState, useEffect } from 'react';
import LeadCountsGraph from './LeadCountsGraph';
import StageBarChart from '../manager/StageBarChart';

function StaffAnalysis() {
  const [leadCounts, setLeadCounts] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchLeadCounts() {
      try {
        const res = await fetch('http://127.0.0.1:8000/staff/all-leads', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        if (!res.ok) {
          alert("Failed to fetch lead data");
          return;
        }

        setLeadCounts({
          open_ld: data.ld_counts?.open_ld || 0,
          in_prog: data.ld_counts?.in_prog || 0,
          won_ld: data.ld_counts?.won_ld || 0,
          lost_ld: data.ld_counts?.lost_ld || 0,
          tot_lead: data.all_leads?.length || 0,
          leads: data.all_leads
        });

      } catch (err) {
        console.error(err);
        alert("Error fetching lead data");
      }
    }

    fetchLeadCounts();
  }, [token]);

  return (
  <div className="container">

    {leadCounts.tot_lead > 0 ? (

      <div className="row">

        {/* ---------------- Left Side: Pie Chart + Description ---------------- */}
        <div className="col-6 d-flex flex-column align-items-center">

          <LeadCountsGraph counts={leadCounts} />

          <div className="mt-2 w-100">
            <div className="p-3 text-center text-muted" style={{ fontSize: '0.85rem' }}>
              *Pie chart showing lead distribution summary.
            </div>
          </div>

        </div>

      <div className="col-6 d-flex flex-column align-items-center">
        <StageBarChart leads={leadCounts.leads} />
        <div className="mt-2 w-100">
          <div className="p-3 text-center text-muted" style={{ fontSize: '0.85rem' }}>
            *Bar chart showing the number of leads in each stage of the sales pipeline.
          </div>
        </div>
      </div>        

      </div>

    ) : (

      <div className="text-center my-5">
        <u><h5>Staff Lead Analysis</h5></u>
        <p>No Leads Available for analysis</p>
      </div>

    )}

  </div>
  );
}

export default StaffAnalysis;


  {/* -------------------- PIE CHART EXPLANATION -------------------- */}
          {/* <div className="col-6 mt-2">
            <div className="p-3 border shadow-sm">
              <h6 className="mb-2 text-center">Lead Summary</h6>
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between"><span>Open Leads</span><strong>{leadCounts.open_ld}</strong></li>
                <li className="list-group-item d-flex justify-content-between"><span>In Progress</span><strong>{leadCounts.in_prog}</strong></li>
                <li className="list-group-item d-flex justify-content-between"><span>Won Leads</span><strong>{leadCounts.won_ld}</strong></li>
                <li className="list-group-item d-flex justify-content-between"><span>Lost Leads</span><strong>{leadCounts.lost_ld}</strong></li>
                <li className="list-group-item d-flex justify-content-between bg-light"><span>Total Leads</span><strong>{leadCounts.tot_lead}</strong></li>
              </ul>
            </div>
          </div> */}
