import React, { useState, useEffect } from 'react'

function ServiceDisplay() {

    const [serviceModal , setServiceModal] = useState(false)
    const [serviceInputs , setServiceInputs] = useState([{ value:"" }])
    const [services , setServices] = useState([])
    const [editService , setEditService] = useState(null) // for edit modal
    const [editValue , setEditValue] = useState("")       // current edit value
    const [editActive , setEditActive] = useState(true)   // current is_active value

    const token = localStorage.getItem("token") 

    async function getServices() {
        try {
            const res = await fetch("http://localhost:8000/services" , {
                headers:{
                    "Authorization": `Bearer ${token}`
                }
            })
            const data = await res.json()
            setServices(data)
        } catch (error) {
            console.log("Error fetching services", error)
        }
    }

    useEffect(()=>{
        getServices()
    }, [])

    function handleServiceChange(e , index){
        const values = [...serviceInputs]
        values[index].value = e.target.value
        setServiceInputs(values)
    }

    function addServiceField(){
        setServiceInputs([...serviceInputs , { value:"" }])
    }

    function removeServiceField(index){
        const values = [...serviceInputs]
        values.splice(index , 1)
        setServiceInputs(values)
    }

    async function saveServices(){
        const payload = {
            services : serviceInputs.map(s => s.value).filter(v => v.trim() !== "")
        }
        if(payload.services.length === 0) return
        try{
            let res = await fetch("http://127.0.0.1:8000/manager/services",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })
            let data = await res.json()
            if(!res.ok){
                alert(`${data.detail}`)
                return
            }
            alert(`${data.message}`)
            setServiceModal(false)
            setServiceInputs([{ value:"" }])
            getServices()
        }catch(error){
            console.log("Error saving services", error)
        }
    }

    // open edit modal
    function openEditModal(service){
        setEditService(service)
        setEditValue(service.name)
        setEditActive(service.is_active)
    }

    // handle edit input change
    function handleEditChange(e){
        setEditValue(e.target.value)
    }

    // handle toggle active
    function toggleActive(){
        setEditActive(prev => !prev)
    }

    // save edit
    async function saveEdit(){
        if(!editValue.trim()) return alert("Service name cannot be empty")
        try{
            const payload = { 
                name: editValue.trim(),
                is_active: editActive
            }
            const res = await fetch(`http://127.0.0.1:8000/manager/services/${editService.id}`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })
            const data = await res.json()
            if(!res.ok) return alert(data.detail)
            alert(data.message)
            setEditService(null)
            setEditValue("")
            getServices()
        }catch(error){
            console.log("Error updating service", error)
        }
    }

    return (
        <div className='container' style={{height:"80vh", overflowY:"auto"}}>

            <div className="row justify-content-center">
                <div className="col-lg-10 col-md-10 mt-4">
                    <div className='text-end pb-2'>
                        <button className='btn btn-outline-primary btn-sm' onClick={()=>setServiceModal(true)}>+ Add Service</button>
                    </div>

                    <div className='border shadow p-3' style={{minHeight:"395px" , maxHeight:"400px", overflowY:"scroll"}}>
                        <h5 className='text-center'><u>Services</u></h5>

                        <table className='table table-hover text-center'>
                            <thead>
                                <tr>
                                    <th>sl.</th>
                                    <th>service</th>
                                    <th>active</th>
                                    <th>edit</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    services.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className='text-center text-muted'>
                                                No Service Available
                                            </td>
                                        </tr>
                                    ) : (
                                        services.map((sv , index)=>(
                                            <tr key={sv.id}>
                                                <td>{index + 1}</td>
                                                <td>{sv.name}</td>
                                                <td>{sv.is_active ? "Yes" : "No"}</td>
                                                <td>
                                                    <button className='btn btn-sm btn-outline-primary' onClick={()=>openEditModal(sv)}>
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                }
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>

            {/* service modal */}
            {
                serviceModal && (
                    <div className="modal d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">

                                <div className="modal-header">
                                    <h5 className="modal-title">Add Service</h5>
                                    <button className="btn-close" onClick={()=>setServiceModal(false)}></button>
                                </div>

                                <div className="modal-body">
                                    {serviceInputs.map((field , index)=>(
                                        <div key={index} className="d-flex mb-2">
                                            <input type="text"  className="form-control" value={field.value} onChange={(e)=>handleServiceChange(e,index)} placeholder="Service Name"/>
                                            <button className="btn btn-danger ms-2" onClick={()=>removeServiceField(index)}> X </button>
                                        </div>
                                    ))}
                                    <button className="btn btn-sm btn-secondary" onClick={addServiceField}>+ Add Field</button>
                                </div>

                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={()=>setServiceModal(false)}>Close</button>
                                    <button className="btn btn-primary" onClick={saveServices}>Save</button>
                                </div>

                            </div>
                        </div>
                    </div>
                )
            }

            {/* edit modal */}
            {
                editService && (
                    <div className="modal d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">

                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Service</h5>
                                    <button className="btn-close" onClick={()=>setEditService(null)}></button>
                                </div>

                                <div className="modal-body">
                                    <input type="text" className="form-control mb-2" value={editValue} onChange={handleEditChange} />
                                    <div className="form-check mt-2">
                                        <input type="checkbox" className="form-check-input" id="activeCheck" checked={editActive} onChange={toggleActive} />
                                        <label className="form-check-label" htmlFor="activeCheck">Active</label>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={()=>setEditService(null)}>Close</button>
                                    <button className="btn btn-primary" onClick={saveEdit}>Save</button>
                                </div>

                            </div>
                        </div>
                    </div>
                )
            }

        </div>
    )
}

export default ServiceDisplay