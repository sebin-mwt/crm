import React from 'react';

function TotalRevenueCard({ total }) {
  
  return (

    <div className='border shadow p-3 text-center'>
      <h5>
        <i className="fa-solid fa-coins" style={{ color: "rgb(255, 193, 7)" }}></i> Total Revenue
      </h5>

      <span className='fw-bold fs-4' style={{ color: "rgb(255, 193, 7)" }}>
        ₹{total}
      </span>
      
    </div>

  );
}

export default TotalRevenueCard;