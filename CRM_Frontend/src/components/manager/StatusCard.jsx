import React from 'react';

function StatusCard({ statuses, stages, openEditStatusModal }) {
  return (
    <div className="col-lg-6 col-md-10 mt-4">
      <div className='text-end pb-2'>
        {/* Add Status button will be handled in StageDisplay */}
      </div>

      <div className='border shadow p-2' style={{ maxHeight: "400px", overflowY: "scroll" }}>
        <h5 className='text-center mt-3'><u>Status</u></h5>
        <table className='table table-hover text-center'>
          <thead>
            <tr>
              <th>sl.</th>
              <th>status</th>
              <th>Stage</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {statuses.length === 0 ? (
              <tr>
                <td colSpan="4" className='text-center text-muted'>No Status Available</td>
              </tr>
            ) : (
              statuses.map((st, index) => (
                <tr key={st.id}>
                  <td>{index + 1}</td>
                  <td>{st.name}</td>
                  <td>{stages.find(s => s.id === st.stage_id)?.name || st.stage}</td>
                  <td>
                    <a href="#" onClick={() => openEditStatusModal(st)}><i className="fa-solid fa-pen"></i></a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StatusCard;