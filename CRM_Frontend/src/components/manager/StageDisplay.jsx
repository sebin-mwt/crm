import React, { useState, useEffect } from "react";
import StageTable from "./tables/StageTable";
import StatusTable from "./tables/StatusTable";

function StageDisplay() {

  const [stageModal, setStageModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);

  const [stageInputs, setStageInputs] = useState([{ value: "" }]);
  const [statusInputs, setStatusInputs] = useState([{ name: "", stage_id: "" }]);

  const [stages, setStages] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [editStageModal, setEditStageModal] = useState(false);
  const [editStageData, setEditStageData] = useState({ id: "", name: "" });

  const [editStatusModal, setEditStatusModal] = useState(false);
  const [editStatusData, setEditStatusData] = useState({ id: "", name: "", stage_id: "" });

  const token = localStorage.getItem("token");
  const BASE_URL = "http://localhost:8000/manager";

  async function getStageStatus() {

    try {

      const stageRes = await fetch(`${BASE_URL}/lead/stage`, {
         headers: { 
            Authorization: `Bearer ${token}`
         }
      });

      const stageData = await stageRes.json();

      const statusRes = await fetch(`${BASE_URL}/lead/status`, { 
        headers: { 
            Authorization: `Bearer ${token}`
         }
        });
        
      const statusData = await statusRes.json();

      setStages(stageData);
      setStatuses(statusData);

    } catch (error) {
      console.log("Error fetching data", error);
    }

  }

  useEffect(() => {
    getStageStatus();
  }, []);

  /* ---------- Stage Handlers ---------- */

  function handleStageChange(e, index) {
    const values = [...stageInputs];
    values[index].value = e.target.value;
    setStageInputs(values);
  }

  function addStageField() {
    setStageInputs([...stageInputs, { value: "" }]);
  }

  function removeStageField(index) {
    const values = [...stageInputs];
    values.splice(index, 1);
    setStageInputs(values);
  }

  async function saveStages() {

    const payload = { leadstages: stageInputs.map((s) => s.value).filter((v) => v.trim() !== "") };

    if (payload.leadstages.length === 0) return;

    try {

      const res = await fetch(`${BASE_URL}/lead-stage/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) return alert(data.detail);

      alert(data.message);

      setStageModal(false);
      setStageInputs([{ value: "" }]);

      getStageStatus();

    } catch (error) {
      console.log("Error saving stages", error);
    }

  }

  function openEditStageModal(stage) {
    setEditStageData({ id: stage.id, name: stage.name });
    setEditStageModal(true);
  }

  function handleEditStageChange(e) {
    setEditStageData({ ...editStageData, name: e.target.value });
  }

  async function saveEditedStage() {

    try {

      const res = await fetch(`${BASE_URL}/lead-stage/${editStageData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editStageData.name })
      });

      const data = await res.json();

      if (!res.ok) return alert(data.detail);

      alert(data.message);

      setEditStageModal(false);
      getStageStatus();

    } catch (err) {
      console.log("Error updating stage", err);
    }

  }

  /* ---------- Status Handlers ---------- */

  function handleStatusChange(e, index) {

    const { name, value } = e.target;
    const values = [...statusInputs];

    values[index][name] = value;

    setStatusInputs(values);

  }

  function addStatusField() {
    setStatusInputs([...statusInputs, { name: "", stage_id: "" }]);
  }

  function removeStatusField(index) {
    const values = [...statusInputs];
    values.splice(index, 1);
    setStatusInputs(values);
  }

  async function saveStatus() {

    const cleaned = statusInputs.filter((s) => s.name.trim() !== "" && s.stage_id !== "");

    if (cleaned.length === 0) return;

    const payload = { lead_statuses: cleaned };

    try {

      const res = await fetch(`${BASE_URL}/lead-status/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) return alert(data.detail);

      alert(data.message);

      setStatusModal(false);
      setStatusInputs([{ name: "", stage_id: "" }]);

      getStageStatus();

    } catch (error) {
      console.log("Error saving status", error);
    }

  }

  function openEditStatusModal(status) {
    setEditStatusData({ id: status.id, name: status.name, stage_id: status.stage_id });
    setEditStatusModal(true);
  }

  function handleEditStatusChange(e) {
    const { name, value } = e.target;
    setEditStatusData({ ...editStatusData, [name]: value });
  }

  async function saveEditedStatus() {

    try {

      const res = await fetch(`${BASE_URL}/lead-status/${editStatusData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editStatusData.name, stage_id: editStatusData.stage_id })
      });

      const data = await res.json();

      if (!res.ok) return alert(data.detail);

      alert(data.message);

      setEditStatusModal(false);
      getStageStatus();

    } catch (err) {
      console.log("Error updating status", err);
    }

  }

  return (

    <div className="container">

      <div className="row">
    
        <StageTable stages={stages} openAddModal={() => setStageModal(true)} openEditModal={openEditStageModal} />

        <StatusTable statuses={statuses} openAddModal={() => setStatusModal(true)} openEditModal={openEditStatusModal} />

      </div>

      {/* ---------- Add Stage Modal ---------- */}

      {stageModal && (

        <div className="modal d-block">

          <div className="modal-dialog  modal-dialog-centered">

            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Add Stage</h5>
                <button className="btn-close" onClick={() => setStageModal(false)}></button>
              </div>

              <div className="modal-body">

                {stageInputs.map((field, index) => (

                  <div key={index} className="d-flex mb-2 align-items-center">

                    <label className="me-2">{index + 1}.</label>

                    <input type="text" className="form-control" value={field.value} onChange={(e) => handleStageChange(e, index)} />

                    <button className="btn btn-danger ms-2" onClick={() => removeStageField(index)} disabled={stageInputs.length === 1}>
                      <i className="fa fa-trash"></i>
                    </button>

                  </div>

                ))}

                <button className="btn btn-sm btn-secondary" onClick={addStageField}>+ Add Field</button>

              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setStageModal(false)}>Close</button>
                <button className="btn btn-primary" onClick={saveStages}>Save</button>
              </div>

            </div>

          </div>

        </div>

      )}

      {/* ---------- Add Status Modal ---------- */}

      {statusModal && (

        <div className="modal d-block">

          <div className="modal-dialog  modal-dialog-centered ">

            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Add Status</h5>
                <button className="btn-close" onClick={() => setStatusModal(false)}></button>
              </div>

              <div className="modal-body">

                {statusInputs.map((field, index) => (

                  <div key={index} className="mb-3">

                    <label>{index + 1}.</label>

                    <input type="text" name="name" placeholder="Status Name" className="form-control mb-2" value={field.name} onChange={(e) => handleStatusChange(e, index)} />

                    <select name="stage_id" className="form-select" value={field.stage_id} onChange={(e) => handleStatusChange(e, index)}>
                      <option value="">Select Stage</option>
                      {stages.map(stage => (
                        <option key={stage.id} value={stage.id}>{stage.name}</option>
                      ))}
                    </select>

                    <button className="btn btn-danger btn-sm mt-2" onClick={() => removeStatusField(index)} disabled={statusInputs.length === 1}>
                      <i className="fa fa-trash"></i>
                    </button>

                  </div>

                ))}

                <button className="btn btn-sm btn-secondary" onClick={addStatusField}>+ Add Field</button>

              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setStatusModal(false)}>Close</button>
                <button className="btn btn-primary" onClick={saveStatus}>Save</button>
              </div>

            </div>

          </div>

        </div>

      )}

      {/* ---------- Edit Stage Modal ---------- */}

      {editStageModal && (

        <div className="modal d-block">

          <div className="modal-dialog  modal-dialog-centered ">

            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Edit Stage</h5>
                <button className="btn-close" onClick={() => setEditStageModal(false)}></button>
              </div>

              <div className="modal-body">
                <input type="text" className="form-control" value={editStageData.name} onChange={handleEditStageChange} />
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditStageModal(false)}>Close</button>
                <button className="btn btn-primary" onClick={saveEditedStage}>Save</button>
              </div>

            </div>

          </div>

        </div>

      )}

      {/* ---------- Edit Status Modal ---------- */}

      {editStatusModal && (

        <div className="modal d-block">

          <div className="modal-dialog  modal-dialog-centered ">

            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Edit Status</h5>
                <button className="btn-close" onClick={() => setEditStatusModal(false)}></button>
              </div>

              <div className="modal-body">

                <input type="text" name="name" className="form-control mb-2" value={editStatusData.name} onChange={handleEditStatusChange} />

                <select name="stage_id" className="form-select" value={editStatusData.stage_id} onChange={handleEditStatusChange}>
                  <option value="">Select Stage</option>
                  {stages.map(stage => (
                    <option key={stage.id} value={stage.id}>{stage.name}</option>
                  ))}
                </select>

              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditStatusModal(false)}>Close</button>
                <button className="btn btn-primary" onClick={saveEditedStatus}>Save</button>
              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default StageDisplay;