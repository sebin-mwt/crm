import React from 'react'
import { useState } from 'react'
import { useNavigate , Link } from 'react-router-dom'
import "./register.css"

function Register() {

    const [formData , setFormData] = useState({"name":"" , "email":"", "password":"" , "role":""})

    const [errors , setErrors] = useState({})
    const navigate = useNavigate()

    const emailCheck = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    function handleChange(e){

        const data = {...formData ,[e.target.name]:e.target.value}
        setErrors({...errors,[e.target.name]:""})
        setFormData(data);
    
    }

    async function handleSubmit(e){

        e.preventDefault();

        let newErrors = {}

        if(!formData.name) newErrors.name = "* Name is required" ;

        if(!formData.email){

            newErrors.email = "* Email is required"

        }else if( !emailCheck.test(formData.email) ){
            newErrors.email = "*Invalid email format";
        }

        if(!formData.password) newErrors.password = "* Password required";
        
        if(!formData.role) newErrors.role = "* Role is required"

        if (Object.keys(newErrors).length > 0){
            setErrors(newErrors);
            return;
        }

        try{

            let res = await fetch('http://127.0.0.1:8000/register',{
                method:"POST",headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(formData)
            })

            let data = await res.json()

            if(!res.ok) return alert(`${data.detail}`);

            alert(`${data.message}`)
            
            navigate('/');            

        }catch(err){
            alert(`Error Occured , ${err}`)
        }
        
    }

  return (

    
    <div className='reg-parent'>
    
        <div className='container border p-2 shadow w-50' id='container' >
    
            <div>
                <h3 className='text-center'><u>Register Form</u></h3>
            </div>
    
            <form action="" onSubmit={handleSubmit}>
    
                <div>
                    <label className='form-label' htmlFor="">Name :</label>
                    <input className='form-control' type="text" value={formData.name} name='name' onChange={handleChange}/>
                    <span className='text-danger'>{errors.name}</span>
                </div>
    
                <div>
                    <label className='form-label' htmlFor="">Email :</label>
                    <input className='form-control' type="text" value={formData.email} name='email' onChange={ handleChange}/>
                    <span className='text-danger'>{errors.email}</span>
                </div>
    
                <div>
                    <label className='form-label' htmlFor="">Password :</label>
                    <input className='form-control' type="password" value={formData.password}  name='password' onChange={ handleChange}/>
                    <span className='text-danger'>{errors.password}</span>
                </div>
    
                <div>
    
                    <label className='form-label' htmlFor="">Role :</label>
                    <select className='form-control'  name="role" id="" onChange={ handleChange} value={formData.role}>
                        <option value="">--Select Role--</option>
                        <option value='staff'>Staff</option>
                        <option value="manager">Manager</option>
                    </select>
                    <span className='text-danger'>{errors.role}</span>
    
                </div>
                
                <div className='text-center mt-3'>
                    <button className='btn btn-outline-primary'  type='submit'>Register</button>
                </div>
    
            </form>

        <div className='text-end'>
            <Link to={'/'}>Already Registered? Login</Link>
        </div>
            
        </div>
    
    </div>

  )
}

export default Register