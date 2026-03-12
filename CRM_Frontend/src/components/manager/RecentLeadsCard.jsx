import React from "react";

function RecentLeadsCard({ leads, handleStatusColor }) {
  // Take last 5 leads sorted by created_at
  const recentLeads = leads
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="card border shadow-sm mb-4">
      <div className="card-header">
        <strong>Recent Leads</strong>
      </div>
      <div className="card-body p-0">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Company / Lead</th>
              <th>Assigned To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentLeads.length > 0 ? (
              recentLeads.map((ld, i) => (
                <tr key={i}>
                  <td>
                    <strong>{ld.company}</strong>
                    <br />
                    <small className="text-muted">{ld.title}</small>
                  </td>
                  <td>{ld.staff || "-"}</td>
                  <td>
                    <span className={`badge ${handleStatusColor(ld.status)}`}>
                      {ld.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  No Leads
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentLeadsCard;