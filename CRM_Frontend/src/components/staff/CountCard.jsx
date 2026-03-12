import React from "react";

function CountCard({ title, count, iconClass, color }) {

  return (

    <div className="col-md-3 col-sm-6 col-xs-12 p-sm-2">
      <div className="border shadow p-2 d-flex flex-column align-items-center">
        <h5>
          <i className={iconClass} style={{ color }}></i> {title}
        </h5>
        <span className="fw-bold" style={{ color }}>{count}</span>
      </div>
    </div>
  );
  
}

export default CountCard