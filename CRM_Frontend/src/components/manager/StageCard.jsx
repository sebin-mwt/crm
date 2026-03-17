import React from 'react';

function StageCard({ stages, openEditStageModal }) {
  return (
    <div className='col-lg-6 col-md-10 mt-4'>
      <div className='text-end pb-2'>
        
      </div>

      <div className='border shadow p-3' style={{ minHeight: "395px", maxHeight: "400px", overflowY: "scroll" }}>
        <h5 className='text-center'><u>Stages</u></h5>
        <table className='table table-hover text-center'>
          <thead>
            <tr>
              <th>sl.</th>
              <th>stage</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {stages.length === 0 ? (
              <tr>
                <td colSpan="3" className='text-center text-muted'>No Stage Available</td>
              </tr>
            ) : (
              stages.map((stage, index) => (
                <tr key={stage.id}>
                  <td>{index + 1}</td>
                  <td>{stage.name}</td>
                  <td>
                    <a href="#" onClick={() => openEditStageModal(stage)}><i className="fa-solid fa-pen"></i></a>
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

export default StageCard;