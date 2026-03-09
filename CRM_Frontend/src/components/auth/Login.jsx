import React from 'react'
import { useState } from 'react'
import { useNavigate ,Link} from 'react-router-dom'
import "./register.css"

function Login() {

    const [formData , setFormData] = useState({"email":"" , "password":""}) 
    const [errors , setErrors] = useState({})

    const navigate = useNavigate()

    const handleChange = (e)=>{

        const data = {...formData, [e.target.name]:e.target.value};
        setFormData(data);
        setErrors({...errors , [e.target.name]:""})
    }

    async function handleSubmit(e) {

        e.preventDefault();
        let newErrors = {};

        if(!formData.email) newErrors.email = "*Email required!"
        if(!formData.password) newErrors.password = "*Password Required"

        if (Object.keys(newErrors).length > 0){
            setErrors(newErrors);
            return;
        }

        try{

            let res = await fetch("http://127.0.0.1:8000/login",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body : JSON.stringify(formData)
            })

            let data =await res.json()

            if(!res.ok) return alert(`${data.detail}`);

            let access_token = data.access_token
            let role = data.user_data.role
            
            localStorage.setItem("token", access_token)
            localStorage.setItem("user",JSON.stringify(data.user_data))
            
            if(role ==="staff"){
                navigate('/staff/dashboard')
            }else if(role==="manager"){
                navigate('/manager/dashboard')
            }else if(role==="management"){
                navigate('/owner/dashboard')                
            }

            setFormData({"email":"" , "password":""})
            return;

        }catch(err){
            alert(`Error Occured : ${err}`);
            return;
        }
    }

  return (

    <div className='reg-parent'>

     <div className='container border p-2 shadow' id='lcontainer'>

    <form action="" onSubmit={handleSubmit}>
        
            <div className='text-center'>
                <h3><u>SignIn Form</u></h3>
            </div>
        
                <div>
                    <label className='form-label'>Email :</label>
                    <input type="text" className='form-control' name='email' value={formData.email} onChange={handleChange} />
                    <span className='text-danger'>{errors.email}</span>
                </div>
        
                <div>
                    <label  className='form-label'>Password :</label>
                    <input type="password" className='form-control' name='password' value={formData.password} onChange={handleChange} />
                    <span className='text-danger'>{errors.password}</span>
                </div>

                <div className='text-center mt-2'>
                    <button className='btn btn-outline-primary' type='submit'> Login</button>
                </div>
        
    </form >

    <div className='text-end me-2'>
        <Link to={'/register'}>Not Register?Register </Link>
    </div>
    </div>
    </div>
  )
}

export default Login