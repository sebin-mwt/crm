import React, { useEffect, useState } from "react";

function DocumentsTab({ leadId, token, basePath = "staff", readOnly = false }) {

  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, [leadId]);

  const fetchDocuments = async () => {

    const res = await fetch(`http://127.0.0.1:8000/${basePath}/${leadId}/documents`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setDocuments(data);
  };

  return (

    <div style={{ maxHeight: "260px", overflowY: "auto" }}>

      {documents.length === 0 ? (

        <p className="text-muted">No documents uploaded</p>

      ) : (

        documents.map((doc) => (

          <div
            key={doc.id}
            className=" border rounded p-2 mb-2"
          >

            {/* Left side */}
            <div className="d-flex align-items-center gap-2">

              <i className="fa-solid fa-file-lines text-primary"></i>

              <div>

                <a href={`http://localhost:8000${doc.file_url}`} target="_blank" rel="noreferrer" className="fw-semibold text-decoration-none">
                  {doc.file_url.split("/").pop()}
                </a>

                <div className="small text-muted">
                  Uploaded by {doc.uploaded_by}
                  {doc.uploaded_at && (
                    <> • {new Date(doc.uploaded_at).toLocaleDateString()}</>
                  )}
                </div>

              </div>

            </div>

          </div>

        ))

      )}

    </div>

  );
}

export default DocumentsTab;