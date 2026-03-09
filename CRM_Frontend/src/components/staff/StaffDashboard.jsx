import React ,{useState , useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'

function StaffDashboard() {

  const [leadData , setLeadData] = useState([])
  const [ldCount , setldCount] = useState({})

  const navigate = useNavigate();
  const token = localStorage.getItem('token')

  async function getLeads() {

    let res = await fetch('http://127.0.0.1:8000/staff/all-leads',{
      headers:{
        Authorization : `Bearer ${token}`
      }
    })

    let data = await res.json()

    if(!res.ok){
      alert("Failure in response")
    }

    setLeadData(data.all_leads);

    setldCount({open_ld : data.ld_counts.open_ld , 
                in_prog : data.ld_counts.in_prog , 
                won_ld : data.ld_counts.won_ld , 
                lost_ld : data.ld_counts.lost_ld})
  }
  
  function handleStatusColor(sts){

    const colors ={
      Won : 'bg-success',
      Lost : 'bg-danger',
      "On Hold" : 'bg-warning',
      "Closed/Inactive" : "bg-danger",
      Contacted : "bg-info"
    }
   return colors[sts] ||'bg-primary'
  }

  useEffect(()=>{
    getLeads()
  },[])

  return (

    <div>

      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h4>Leads</h4>
        <button className='btn btn-primary' onClick={() => navigate('/staff/create-lead')}>
          + Create New Lead
        </button>
      </div>

      <div className='row'>
          <div className="col-md-3 col-sm-6 col-xs-12 p-sm-2 ">
              <div className='border shadow p-2 d-flex flex-column align-items-center'>
                  <h5> <i className="fa-solid fa-suitcase" style={{"color":"rgb(86, 61, 246)"}}></i> Open Leads</h5>
                  <span className='fw-bold' style={{"color":"rgb(86, 61, 246)"}}>{ldCount.open_ld}</span>
              </div>
          </div>

          <div className="col-md-3 col-sm-6 col-xs-12 p-sm-2">
             <div className='border shadow p-2 d-flex flex-column align-items-center'>
                  <h5> <i className="fa-solid fa-suitcase"  style={{"color":"rgb(209, 215, 27)"}}></i>In Progress</h5>
                  <span style={{"color":"rgb(209, 215, 27)"}} className='fw-bold'>{ldCount.in_prog}</span>
              </div>
          </div>

          <div className="col-md-3 col-sm-6 col-xs-12 p-sm-2">
             <div className='border shadow p-2 d-flex flex-column align-items-center'>
                  <h5> <i className="fa-solid fa-shield-heart" style={{"color": "rgb(9, 125, 90)"}}></i> Won Leads </h5>
                  <span className='fw-bold' style={{"color": "rgb(10, 152, 110)"}}>{ldCount.won_ld}</span>
              </div>
          </div>

          <div className="col-md-3 col-sm-6 col-xs-12 p-sm-2">
             <div className='border shadow p-2 d-flex flex-column align-items-center'>
                  <h5> <i className="fa-solid fa-heart-crack" style={{"color" : "rgb(249, 65, 65)"}}></i> Lost Leads</h5>
                  <span className='fw-bold' style={{"color" : "rgb(249, 65, 65)"}}>{ldCount.lost_ld}</span>
              </div>
          </div>

      </div>

      <hr />

      <div>
        <h4><u>All Leads</u></h4>

        <div className='border shadow-sm' style={{maxHeight:"320px" , overflowY:"scroll"}}>
          <table className='table'>
            <thead> 
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Stage</th>
                <th>Status</th>
                <th>Value</th>
                <th>Expected Closing</th>
                <th>Service</th>
                <th></th>
              </tr>
            </thead>

            <tbody>

            {leadData.length > 0 ? leadData.map((d,i)=>(
              <tr key={i}>
                <td>{d.title}</td>
                <td>{d.company}</td>
                <td>{d.stage}</td>
                <td ><span className={`badge ${handleStatusColor(d.status)}`}>{d.status}</span></td>
                <td>₹{d.value}</td>
                <td>{ new Date(d.closing).toLocaleDateString('en-GB')}</td>
                <td>{d.service}</td>
                <td><Link to={`/staff/${d.id}/lead`} title='view'><i className="fa-solid fa-eye"></i></Link></td>
              </tr>))
             :
            <tr> 
              <td colSpan= "6" className='text-center'>No Leads</td>
            </tr>
             
            }
              
            </tbody>

          </table>
        </div>
      </div>

    </div>
  )
}

export default StaffDashboard