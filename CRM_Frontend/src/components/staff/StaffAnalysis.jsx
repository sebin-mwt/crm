import React, { useState, useEffect } from 'react';
import LeadCountsGraph from './LeadCountsGraph';

function StaffAnalysis() {
  const [leadCounts, setLeadCounts] = useState({});

  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchLeadCounts() {
      try {
        const res = await fetch('http://127.0.0.1:8000/staff/all-leads', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (!res.ok) {
          alert("Failed to fetch lead data");
          return;
        }

        setLeadCounts({
          open_ld: data.ld_counts?.open_ld ||0,
          in_prog: data.ld_counts?.in_prog ||0,
          won_ld: data.ld_counts?.won_ld || 0,
          lost_ld: data.ld_counts?.lost_ld ||0,
          tot_lead : data.all_leads?.length ||0
        });
      } catch (err) {
        console.error(err);
        alert("Error fetching lead data");
      }
    }

    fetchLeadCounts();
  }, [token]);

  return (
    <div>
      <h5 className='text-center my-3'>Staff Lead Analysis</h5>
      <LeadCountsGraph counts={leadCounts} />
    </div>
  );
}

export default StaffAnalysis;