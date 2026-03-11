import React, { useEffect, useState } from "react";

function DocumentsTab({ leadId, token }) {

  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {

    const res = await fetch(`http://127.0.0.1:8000/staff/${leadId}/documents`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setDocuments(data);
  };

  return (

    <div style={{ maxHeight: "240px",overflow:"scroll"}}>

      {documents.length === 0 ? (
        <p>No documents</p>
      ) : (
        documents.map((doc) => (

          <div key={doc.id} className="border-bottom pb-2 mb-2">

            <a
              href={`http://localhost:8000${doc.file_url}`}
              target="_blank"
              rel="noreferrer"
            >
              {doc.file_url.split("/").pop()}
            </a>

          </div>

        ))
      )}

    </div>
  );
}

export default DocumentsTab;