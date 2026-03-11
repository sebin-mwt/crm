import React, { useEffect, useState } from "react";

function ActivitiesTab({ leadId, token }) {

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {

    try {

      setLoading(true);

      const res = await fetch(`http://127.0.0.1:8000/staff/${leadId}/activities`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (!res.ok) throw new Error("Failed to fetch activities");

      const data = await res.json();
      setActivities(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  if (loading) return <p>Loading activities...</p>;

  return (
    <div  style={{ maxHeight: "240px",overflow:"scroll"}}>

      {activities.length === 0 ? (
        <p>No activities</p>
      ) : (
        activities.map((act) => (

          <div key={act.id} className="border-bottom pb-2 mb-2">

            <div>
             <p title={act.description}> {new Date(act.date).toLocaleDateString("en-GB")} → {act.title}</p>
            </div>

          </div>

        ))
      )}

    </div>
  );
}

export default ActivitiesTab;