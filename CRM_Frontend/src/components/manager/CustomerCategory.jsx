import React, { useState, useEffect } from 'react'

function CustomerCategoryDisplay() {

    const [categoryModal, setCategoryModal] = useState(false)
    const [editCategoryModal, setEditCategoryModal] = useState(false)

    const [categoryInputs, setCategoryInputs] = useState([{ value: "" }])
    const [categories, setCategories] = useState([])

    const [editCategoryData, setEditCategoryData] = useState({id:"", category_name:""})

    const token = localStorage.getItem("token")
    const BASE_URL = "http://localhost:8000/manager"

    async function getCategories(){
        try {
            const res = await fetch("http://localhost:8000/customer/category", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await res.json()
            setCategories(data)
        } catch(err){
            console.log("Error fetching categories", err)
        }
    }

    useEffect(()=>{
        getCategories()
    }, [])

 
    function handleCategoryChange(e, index){
        const values = [...categoryInputs]
        values[index].value = e.target.value
        setCategoryInputs(values)
    }

    function addCategoryField(){
        setCategoryInputs([...categoryInputs, {value:""}])
    }

    function removeCategoryField(index){
        const values = [...categoryInputs]
        values.splice(index,1)
        setCategoryInputs(values)
    }

    async function saveCategories(){
        const payload = { categories: categoryInputs.map(c=>c.value).filter(v=>v.trim() !== "") }
        
        if(payload.categories.length === 0) return

        try{
            const res = await fetch(`${BASE_URL}/customer-category/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })
            const data = await res.json()
            if(!res.ok) return alert(data.detail || "Failed")
            alert(data.message)
            setCategoryModal(false)
            setCategoryInputs([{value:""}])
            getCategories()
        }catch(err){
            console.log("Error saving category", err)
        }
    }

    function openEditCategoryModal(cat){
        setEditCategoryData({id: cat.id, category_name: cat.category_name})
        setEditCategoryModal(true)
    }

    function handleEditCategoryChange(e){
        setEditCategoryData({...editCategoryData, category_name: e.target.value})
    }

    async function saveEditedCategory(){

        try{

            const res = await fetch(`${BASE_URL}/customer-category/${editCategoryData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({category_name: editCategoryData.category_name})
            })

            const data = await res.json()

            if(!res.ok) return alert(data.detail)

            alert(data.message)
            setEditCategoryModal(false)
            getCategories()

        }catch(err){
            console.log("Error updating category", err)
        }
    }

    return (
        <div className='container ms-4'>
            <div className="row">
                <div className=" col-lg-10 col-md-10 mt-4">

                    <div className='text-end pb-2'>
                        <button className='btn btn-outline-primary btn-sm' onClick={()=>setCategoryModal(true)}>+ Add Category</button>
                    </div>

                    <div className='border shadow p-3' style={{minHeight:"395px", maxHeight:"400px", overflowY:"scroll"}}>
                        <h5 className='text-center'><u>Customer Categories</u></h5>

                        <table className='table table-hover text-center'>
                            <thead>
                                <tr>
                                    <th>sl.</th>
                                    <th>category</th>
                                    <th>action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length === 0 ? (
                                    <tr><td colSpan="3" className='text-center text-muted'>No Category Available</td></tr>
                                ) : (
                                    categories.map((cat, index)=>(
                                        <tr key={cat.id}>
                                            <td>{index+1}</td>
                                            <td>{cat.category_name}</td>
                                            <td>
                                                <a href="#" onClick={()=>openEditCategoryModal(cat)}><i className="fa-solid fa-pen"></i></a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/*  Add Category Modal  */}
            {categoryModal && (
                <div className="modal d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Customer Category</h5>
                                <button className="btn-close" onClick={()=>setCategoryModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {categoryInputs.map((field,index)=>(
                                    <div key={index} className="d-flex mb-2">
                                        <input type="text" className="form-control" value={field.value} onChange={(e)=>handleCategoryChange(e,index)} placeholder={`Category ${index+1}`}/>
                                        <button className="btn btn-danger ms-2" onClick={()=>removeCategoryField(index)} disabled={categoryInputs.length===1}> X </button>
                                    </div>
                                ))}
                                <button className="btn btn-sm btn-secondary" onClick={addCategoryField}>+ Add Field</button>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={()=>setCategoryModal(false)}>Close</button>
                                <button className="btn btn-primary" onClick={saveCategories}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/*  Edit Category Modal  */}
            {editCategoryModal && (

                <div className="modal d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Customer Category</h5>
                                <button className="btn-close" onClick={()=>setEditCategoryModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input type="text" className="form-control" value={editCategoryData.category_name} onChange={handleEditCategoryChange}/>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={()=>setEditCategoryModal(false)}>Close</button>
                                <button className="btn btn-primary" onClick={saveEditedCategory}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CustomerCategoryDisplay