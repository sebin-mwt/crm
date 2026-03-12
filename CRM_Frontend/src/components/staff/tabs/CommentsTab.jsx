import React, { useEffect, useState, useRef } from "react";
import "./comment.css"
function CommentsTab({ leadId, token, basepath="staff" }) {

  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const [recordTime, setRecordTime] = useState(0);
  const timerRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  useEffect(() => {
    fetchComments();
  }, [leadId]);

  const fetchComments = async () => {

    const res = await fetch(`http://127.0.0.1:8000/${basepath}/${leadId}/comments`, {
      headers: { 
        Authorization: `Bearer ${token}` 
    }
    });

    const data = await res.json();
    setComments(data);

  };

  const sendComment = async () => {

    if (!message.trim()) return;

    try {

      let res = await fetch(`http://127.0.0.1:8000/staff/${leadId}/activity-add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({

          description: message,
          type: "comment"

        })

      });

      if (!res.ok) throw new Error("Failed to upload comment");

      setMessage("");
      fetchComments();

    } catch (err) {

      alert(err.message);

    }
  };

  const startRecording = async () => {

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    streamRef.current = stream;

    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {

    const blob = new Blob(audioChunksRef.current, {
        type: "audio/webm"
    });

    setAudioBlob(blob);

    const url = URL.createObjectURL(blob);
    setAudioUrl(url);

    streamRef.current.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
    setRecording(true);
    setRecordTime(0);

    timerRef.current = setInterval(() => {
    setRecordTime((prev) => prev + 1);
    }, 1000);

   };

  const stopaudio = () => {

    mediaRecorderRef.current.stop();
    setRecording(false);
    clearInterval(timerRef.current);
  };


  const deleteVoice = () => {
    setAudioUrl(null);
    setAudioBlob(null);
    audioChunksRef.current = [];
   };
  const formatTime = (seconds) => {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
  };

  async function handleVoiceCommentSubmit() {

    if(!audioBlob) return;

    let formData = new FormData();

    formData.append("file", audioBlob, "voice.webm");
    formData.append("type","comment");
    formData.append("is_voice_comment",true);

    try{

        let res = await fetch(`http://127.0.0.1:8000/staff/${leadId}/upload`,{
            method:"POST",
            headers:{
                Authorization:`Bearer ${token}`
            },
            body:formData
        });

        if(!res.ok){
            throw new Error("Failed to add comment");
        }

        fetchComments();

        setAudioUrl(null);
        setAudioBlob(null);
        audioChunksRef.current = [];

    }catch(err){
        alert(err.message);
    }

 }

  return (

    <div className="d-flex flex-column">

      {/* Chat Messages */}
    <div className="flex-grow-1 overflow-auto mb-3 " style={{ maxHeight: "240px", background:"#f8f9fa", padding:"10px", borderRadius:"6px" }}>

       {comments.length == 0 ? (
  <p>No comments</p>
) : (

  comments.map((comment) => {
      
    const isMine = comment.created_by === JSON.parse(localStorage.getItem("user")).user_id  ;

    return (

          <div key={comment.id} className={`d-flex mb-2 ${isMine ? "justify-content-end" : "justify-content-start"}`}>

            <div className={`p-2 rounded shadow-sm`} style={{ maxWidth: "70%",background: isMine ? "#d1e7dd" : "#ffffff",border: "1px solid #dee2e6"}}>

              {/* User name */}
              <div className="fw-semibold small mb-1">
                {comment.created_by_name}
              </div>

              {/* Text comment */}
              {comment.text && (
                <div>{comment.text}</div>
              )}

              {/* Voice comment */}
              {comment.voice_url && (
                <audio controls src={comment.voice_url}></audio>
              )}

              {/* Time */}
              <div className="text-muted small mt-1">
                {new Date(comment.created_at).toLocaleString()}
              </div>

            </div>

          </div>

        );
      })

    )}

        <div ref={messagesEndRef}></div>

        </div>

    {/* Voice Preview */}

    {audioUrl && (

    <div className="mb-2 p-2 border rounded bg-light d-flex align-items-center gap-2">

            <button className="btn btn-outline-danger btn-sm" onClick={deleteVoice}>
            <i className="fa fa-trash"></i>
            </button>

            <audio controls src={audioUrl} controlsList="nodownload" className="flex-grow-1"></audio>

            <button className="btn btn-primary btn-sm" onClick={handleVoiceCommentSubmit}>
            <i className="fa-solid fa-paper-plane"></i>
            </button>

        </div>

    )}

      {/* Input Area */}

    {!audioUrl && (

    <div className="d-flex gap-2 align-items-center">

        {!recording && (

        <>
            <input type="text"  className="form-control"  placeholder="Type a comment..." value={message} onChange={(e) => setMessage(e.target.value)} />

            <button  className="btn btn-outline-secondary"  onClick={startRecording}  >  <i className="fa fa-microphone"></i>  </button>

            <button className="btn btn-primary"  onClick={sendComment}  >  <i className="fa fa-paper-plane"></i>  </button>
        </>

        )}

        {recording && (

        <div className="d-flex align-items-center justify-content-end gap-3 w-100">

            <span className="record-dot"></span>

            <span className="fw-bold"> {formatTime(recordTime)} </span>

            <button className="btn btn-danger" onClick={stopaudio}> <i className="fa fa-stop"></i> </button>

        </div>

        )}

    </div>
    )}

    </div>

  );
}

export default CommentsTab;