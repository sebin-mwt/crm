import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function StaffLeadView() {

  const { id } = useParams();

  const token = localStorage.getItem("token");

  const [lead, setLead] = useState(null);

  const [activities, setActivities] = useState([]);

  const [documents, setDocuments] = useState([]);

  const [history, setHistory] = useState([]);

  const [comments, setComments] = useState([]);

  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("activities");

  const [showActivityModal, setShowActivityModal] = useState(false)

  const [activityType, setActivityType] = useState("")

  const [activityData, setActivityData] = useState({title: "",description: "",activity_date: ""})

  const [loading, setLoading] = useState({activities: false,documents: false,history: false,comments: false});

  const [showUploadModal, setShowUploadModal] = useState(false)

  const [uploadedFile, setUploadFile] = useState(null)

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {

    try {
      const res = await fetch(`http://127.0.0.1:8000/staff/${id}/lead`, {

        headers: { 
            Authorization: `Bearer ${token}` 
        },
      });

      if (!res.ok) throw new Error("Failed to fetch lead");

      const data = await res.json();
      setLead(data);

    } catch (err) {
      setError(err.message);
    }
  };


  useEffect(() => {
    if (activeTab === "activities" && activities.length === 0) fetchActivities();
    if (activeTab === "documents" && documents.length === 0) fetchDocuments();
    if (activeTab === "history" && history.length === 0) fetchHistory();
    if (activeTab === "comments" && comments.length === 0) fetchComments();
  }, [activeTab]);


  const fetchActivities = async () => {

    try {
      setLoading((prev) => ({ ...prev, activities: true }));

      const res = await fetch(`http://127.0.0.1:8000/staff/${id}/activities`, {
        headers: { 
            Authorization: `Bearer ${token}`
         },
      });

      if (!res.ok) throw new Error("Failed to fetch activities");

      setActivities(await res.json());

    } catch (err) {

      setError(err.message);

    } finally {
      setLoading((prev) => ({ ...prev, activities: false }));
    }
  };

  const fetchDocuments = async () => {

    try {

      setLoading((prev) => ({ ...prev, documents: true }));

      const res = await fetch(`http://127.0.0.1:8000/staff/${id}/documents`, {
        headers: { 
            Authorization: `Bearer ${token}` 
        },
      });

      if (!res.ok) throw new Error("Failed to fetch documents");

      let docData = await res.json()
      setDocuments(docData);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading((prev) => ({ ...prev, documents: false }));

    }

  };

  const fetchHistory = async () => {

    try {

      setLoading((prev) => ({ ...prev, history: true }));
      
      const res = await fetch(`http://127.0.0.1:8000/staff/${id}/history`, {
        headers: { 
            Authorization: `Bearer ${token}` 
        },
      });

      if (!res.ok) throw new Error("Failed to fetch history");

      let statusData = await res.json()

      setHistory(statusData);

    } catch (err) {

      setError(err.message);

    } finally {
      setLoading((prev) => ({ ...prev, history: false }));
    }
  };

  const fetchComments = async () => {

    try {

      setLoading((prev) => ({ ...prev, comments: true }));

      const res = await fetch(`http://127.0.0.1:8000/staff/${id}/comments`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
      });

      if (!res.ok) throw new Error("Failed to fetch comments");
      let commentData = await res.json()

      setComments(commentData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, comments: false }));
    }
  };

//   Call button actions
  const showAddCallModal = () => {
  setActivityType("call")
  setShowActivityModal(true)
 }

  const closeActivityModal = () => {
    setShowActivityModal(false)
    setActivityData({title: "",description: "",activity_date: ""})
  }

  const handleActivityChange = (e) => {
    const { name, value } = e.target
    setActivityData({ ...activityData, [name]: value})
   }

    const showMeetingModal = () => {
    setActivityType("meeting")
    setShowActivityModal(true)
    }

  // call log / meeting log submission

   const submitActivity = async () => {

    if(!activityData.title || !activityData.description) return;

    let res = await fetch(`http://127.0.0.1:8000/staff/${id}/activity-add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ ...activityData, type: activityType})
  })

  let actData = await res.json()

  if(!res.ok) return alert("Failed to add" || `${actData.detail}`)

  alert(`${actData.message}`)
  setShowActivityModal(false)
  setActivityData({title: "",description: "",activity_date: ""})
  fetchActivities();
  return
  }


    // file modal
    const showUploadModalHandler = () => {
    setShowUploadModal(true)
    }

    const closeUploadModal = () => {
    setShowUploadModal(false)
    }

    const handleFileChange = (e) => {
    setUploadFile(e.target.files[0])
    }
    

   const uploadFile = async () => {

    if(!uploadedFile) return

    const formData = new FormData()

    formData.append("file", uploadedFile)
    formData.append("is_voice_comment",false)

    let res = await fetch(`http://127.0.0.1:8000/staff/${id}/upload`, {

        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
    })
    let upData = await res.json()

    if(!res.ok)return alert("Failed to upload document" || `${upData.detail}`)

    closeUploadModal()
    setUploadData({file: null})
    fetchDocuments()
    alert(`${upData.message}`)
    
  }



  const handleStatusColor = (sts) => {

    const colors = {
      Won: "bg-success",
      Lost: "bg-danger",
      "On Hold": "bg-warning",
      "Closed/Inactive": "bg-danger",
      Contacted: "bg-info",
    };

    return colors[sts] || "bg-primary";

  };

  if (error) return <div className="container mt-4 text-danger">{error}</div>;
  if (!lead) return <div className="container mt-4">Loading lead info...</div>;

  return (

    <div className="container mt-4">
      {/* Lead Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">

          <h3 className="mb-1">
            {lead.title} - {lead.institution?.name}
          </h3>

          <div className="d-flex gap-2 mb-2">
            <button className="btn btn-sm btn-secondary">Change Status</button>
            <button className="btn btn-sm btn-primary">Add Activity</button>
          </div>
        </div>

        <hr />

        <div className="row mt-3">
          <div className="col-md-2">
            <strong>Service</strong>
            <div>{lead.service?.name}</div>
          </div>

          <div className="col-md-2">
            <strong>Value</strong>
            <div>₹ {lead.value}</div>
          </div>

          <div className="col-md-2">
            <strong>Stage</strong>
            <div>
              <span className="badge bg-secondary">{lead.stage?.name}</span>
            </div>
          </div>

          <div className="col-md-2">
            <strong>Status</strong>
            <div>
              <span className={`badge ${handleStatusColor(lead.status?.name)}`}>
                {lead.status?.name}
              </span>
            </div>
          </div>

          <div className="col-md-2">
            <strong>Expected Closing</strong>
            <div>
              {new Date(lead.expected_closing).toLocaleDateString("en-GB", {
                timeZone: "UTC",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        {["activities", "documents", "history", "comments"].map((tab) => (
          <li key={tab} className="nav-item">
            <button className={`nav-link ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)} >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {/* Tab Content */}
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">

              {!loading[activeTab] && activeTab === "activities" && (

                <div>

                  {activities.length === 0 ? (
                    <p>No activities</p>
                  ) : (
                    activities.map((act) => (
                      <div key={act.id} className="border-bottom pb-2 mb-2">
                        <div>{act.description || act.title}</div>
                        <small className="text-muted">{act.created_by}</small>
                      </div>
                    ))
                  )}
                </div>
              )}

              {!loading[activeTab] && activeTab === "documents" && (

                <div>
                  {documents.length === 0 ? (
                    <p>No documents</p>
                  ) : (

                    documents.map((doc) => (
                      <div key={doc.id} className="border-bottom pb-2 mb-2">
                        <a href={`http://localhost:8000${doc.file_url}`} target="_blank" rel="noreferrer">
                        {doc.file_url.split("/").pop()}
                        </a>
                      </div>
                    ))
                  )}
                </div>

              )}

              {!loading[activeTab] && activeTab === "history" && (

                <div>
                  {history.length === 0 ? (

                    <p>No history</p>
                  ) : (
                    history.map((item) => (
                      <div key={item.id} className="border-bottom pb-2 mb-2">
                        <div>
                          {item.old_status} → {item.new_status}
                        </div>
                        <small>
                          {new Date(item.changed_at).toLocaleDateString()}
                        </small>
                      </div>
                    ))
                  )}
                </div>
              )}

              {!loading[activeTab] && activeTab === "comments" && (
                <div>
                  {comments.length === 0 ? (

                    <p>No comments</p>
                  ) : (
                    comments.map((comment) => (

                      <div key={comment.id} className="border-bottom pb-2 mb-2">
                        <div>{comment.text}</div>
                        {comment.voice_url && (
                          <audio controls src={comment.voice_url}></audio>
                        )}

                        <small className="text-muted">
                          {comment.created_by} |{" "}
                          {new Date(comment.created_at).toLocaleString()}
                        </small>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-md-4">
        <div className="card">
            <div className="card-body">
            <h6 className="mb-3">Quick Actions</h6>

            <div className="row text-center">

                {[
                { icon: "fa-phone", label: "Log Call", click: showAddCallModal  },
                { icon: "fa-calendar", label: "Meeting", click: showMeetingModal },
                { icon: "fa-comment", label: "Comment" },
                { icon: "fa-upload", label: "Upload", click: showUploadModalHandler  },
                ].map((action, idx) => (

                <div key={idx} className="col-6 col-md-3 mb-3">

                    <button className="btn btn-light border rounded-circle" style={{ width: "55px", height: "55px" }} onClick={action.click} >
                      <i className={`fa-solid ${action.icon}`}></i>
                    </button>

                    <div className="small mt-1 text-nowrap">{action.label}</div>

                </div>

                ))}

            </div>
            </div>
        </div>
        </div>
      </div>

      {/* Activity modal pop up */}
    {showActivityModal && (
    <div className="modal fade show" style={{display:"block", backgroundColor:"rgba(0,0,0,0.5)"}}>
    <div className="modal-dialog">
        <div className="modal-content">

        <div className="modal-header">
            <h5 className="modal-title">
            {activityType === "call" ? "Log Call" : "Log Meeting Details"}
            </h5>
            <button className="btn-close" onClick={closeActivityModal}></button>
        </div>

        <div className="modal-body">

            <div className="mb-3">
                <label className="form-label">Title</label>
                <input type="text"  name="title" className="form-control" value={activityData.title} onChange={handleActivityChange}/>
            </div>

            <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" rows="3" value={activityData.description} onChange={handleActivityChange} />
            </div>

            <div className="mb-3">
            <label className="form-label">Activity Date</label>
            <input type="date" name="activity_date" className="form-control" value={activityData.activity_date} onChange={handleActivityChange} max={new Date().toISOString().split("T")[0]}/>
            </div>

        </div>

        <div className="modal-footer">

            <button className="btn btn-secondary" onClick={closeActivityModal}>  Cancel   </button>

            <button className="btn btn-primary" onClick={submitActivity}> Save </button>

        </div>

        </div>
    </div>
    </div>

    )}


    {/* Upload Modal pop-up */}
    {showUploadModal && (

    <div className="modal fade show" style={{display:"block", backgroundColor:"rgba(0,0,0,0.5)"}}>
    <div className="modal-dialog">
        <div className="modal-content">

        <div className="modal-header">
            <h5 className="modal-title">Upload Document</h5>
            <button className="btn-close" onClick={closeUploadModal}></button>
        </div>

        <div className="modal-body">
            <div className="mb-3">
            <label className="form-label">Select File</label>
            <input type="file" name="file" className="form-control" onChange={handleFileChange}/>
            </div>
        </div>

        <div className="modal-footer">
            <button className="btn btn-secondary" onClick={closeUploadModal}> Cancel </button>
            <button className="btn btn-primary" onClick={uploadFile}>  Upload </button>
        </div>

        </div>

    </div>
    </div>

    )}

    </div>
  );
}

export default StaffLeadView;