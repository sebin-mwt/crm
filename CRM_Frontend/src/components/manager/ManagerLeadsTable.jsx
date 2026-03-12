import React from "react";
import { Link } from "react-router-dom";

function ManagerLeadsTable({ leads, handleStatusColor }) {

  return (

    <div className="border shadow-sm" style={{ maxHeight: "500px", overflowY: "auto" }}>

      <table className="table table-striped">

        <thead>

          <tr >
            <th>Company - Title</th>
            <th>Stage</th>
            <th>Status</th>
            <th>Value</th>
            <th>Service</th>
            <th>Staff</th>
            <th>View</th>
          </tr>

        </thead>

        <tbody>

          {leads.length > 0 ? (

            leads.map((d, i) => (

              <tr key={i}>

                <td>
                  {d.company}
                  <br />
                  <small className="text-muted">{d.title}</small>
                </td>

                <td>{d.stage}</td>

                <td>
                  <span className={`badge ${handleStatusColor(d.status)}`}>
                    {d.status}
                  </span>
                </td>

                <td>₹{d.value}</td>

                <td>{d.service}</td>

                <td>{d.staff}</td>

                <td>
                  <Link to={`/manager/${d.id}/lead`} title="view">
                    <i className="fa-solid fa-eye"></i>
                  </Link>
                </td>

              </tr>

            ))

          ) : (

            <tr>
              <td colSpan="7" className="text-center">
                No Leads
              </td>
            </tr>

          )}

        </tbody>

      </table>

    </div>

  );
}

export default ManagerLeadsTable;