import React from 'react';
import { Link } from 'react-router-dom';

function LeadsTable({ leads, handleStatusColor, basePath  }) {

  return (
    <div className='border shadow-sm' style={{ maxHeight: "320px", overflowY: "scroll" }}>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Stage</th>
            <th>Status</th>
            <th>Value</th>
            <th>Expected Closing</th>
            <th>Service</th>
            <th>View</th>
          </tr>
        </thead>

        <tbody>
          {leads.length > 0 ? (
            leads.map((d, i) => (
              <tr key={i}>
                <td>{d.title}</td>
                <td>{d.company}</td>
                <td>{d.stage}</td>
                <td>
                  <span className={`badge ${handleStatusColor(d.status)}`}>
                    {d.status}
                  </span>
                </td>
                <td>₹{d.value}</td>
                <td>{new Date(d.closing).toLocaleDateString('en-GB')}</td>
                <td>{d.service}</td>
                <td>
                  <Link to={`${basePath}/${d.id}/lead`} title="view">
                    <i className="fa-solid fa-eye"></i>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className='text-center'>No Leads</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LeadsTable;