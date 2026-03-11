import React from 'react'
import { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom';

function QuickActions({onActivityAdd, setActiveTab}) {
    
    const { id } = useParams();

    const token = localStorage.getItem("token");

    const [showActivityModal, setShowActivityModal] = useState(false)
    
    const [activityType, setActivityType] = useState("")
    
    const [activityData, setActivityData] = useState({title: "",description: "",activity_date: ""})

    const [showUploadModal, setShowUploadModal] = useState(false)
    
    const [uploadedFile, setUploadFile] = useState(null)
    
    // Call button actions
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

    if(!activityData.title || !activityData.description || !activityData.activity_date) return;

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

  setShowActivityModal(false)
  setActivityData({title: "",description: "",activity_date: ""})
  onActivityAdd();
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
    onActivityAdd();
  }


  return (

    <div>
        <div className="card">
            <div className="card-body">
            <h6 className="mb-3">Quick Actions</h6>

            <div className="row text-center">

                {[
                { icon: "fa-phone", label: "Log Call", click: showAddCallModal  },
                { icon: "fa-calendar", label: "Meeting", click: showMeetingModal },
                { icon: "fa-comment", label: "Comment" ,click: () => setActiveTab("comments")},
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
                <input type="text"  name="title" className="form-control" value={activityData.title} onChange={handleActivityChange} placeholder='please provide title..'/>
            </div>

            <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" rows="3" value={activityData.description} onChange={handleActivityChange} placeholder='provide a brief description...' />
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
  )
}

export default QuickActions