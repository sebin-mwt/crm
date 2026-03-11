import React, { useEffect, useState } from "react";

function HistoryTab({ leadId, token }) {

  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {

    const res = await fetch(`http://127.0.0.1:8000/staff/${leadId}/history`, {
      headers: {
         Authorization: `Bearer ${token}`
        },
    });

    const data = await res.json();
    setHistory(data);
  };

  function statusColor(sts){

    let colors= {
        Qualified : "bg-info",
        "Proposal Sent" : "bg-info",
        "New Lead" : "bg-primary",
        "Lost" : "bg-danger" ,
        "Won": "bg-success"

    }

    if(sts === null) return ""

    return colors[sts] || "bg-primary"

  }

  return (

    <div style={{ maxHeight: "270px",overflow:"scroll"}}> 

      {history.length === 0 ? (
        <p>No history</p>
      ) : (
        history.map((item) => (

          <div key={item.id} className="border-bottom pb-2 mb-2">
            <div>
             <span> ( {new Date(item.changed_at).toLocaleDateString()} )</span> : <span className={`badge ${statusColor(item.old_status)}`} >{item.old_status} </span>→ <span className={`badge ${statusColor(item.new_status)}`}>{item.new_status}</span>
            </div>
          </div>

        ))
      )}

    </div>
  );
}

export default HistoryTab;