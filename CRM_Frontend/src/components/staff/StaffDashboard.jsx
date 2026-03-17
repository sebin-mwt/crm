import React ,{useState , useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import CountCard from './CountCard'
import LeadsTable from './LeadsTable'
import TotalRevenueCard from './TotalRevenueCard'

function StaffDashboard() {

  const [leadData , setLeadData] = useState([])
  const [ldCount , setldCount] = useState({ open_ld:0 , in_prog:0 , won_ld:0 , lost_ld:0 })

  const navigate = useNavigate();
  const token = localStorage.getItem('token')

  async function getLeads() {

    try{

      let res = await fetch('http://127.0.0.1:8000/staff/all-leads',{
        headers:{
          Authorization : `Bearer ${token}`
        }
      })

      let data = await res.json()

      if(!res.ok){
        alert("Failure in response")
        return
      }

      setLeadData(data.all_leads || [])

      setldCount({
        open_ld : data.ld_counts?.open_ld || 0,
        in_prog : data.ld_counts?.in_prog || 0,
        won_ld : data.ld_counts?.won_ld || 0,
        lost_ld : data.ld_counts?.lost_ld || 0
      })

    }catch(err){
      console.log("Error fetching leads",err)
    }
  }
  
  const totalRevenue = (leadData || [])
  .filter(ld => ld.stage === 'Post-Sales')
  .reduce((sum , ld) => sum + (ld.value || 0) , 0)

  function handleStatusColor(sts){

    const colors ={
      Won : 'bg-success',
      Lost : 'bg-danger',
      "On Hold" : 'bg-warning',
      "Closed/Inactive" : "bg-danger",
      Contacted : "bg-info"
    }

    return colors[sts] || 'bg-primary'
  }

  useEffect(()=>{
    getLeads()
  },[])

  return (

    <div>

      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h4>Leads</h4>

        <button className='btn btn-primary' onClick={()=>navigate('/staff/create-lead')}>
          + Create New Lead
        </button>
      </div>

      <div className="row">

        {
          [
            { title:"Open Leads" , count:ldCount.open_ld , icon:"fa-solid fa-suitcase" , color:"rgb(86, 61, 246)" },
            { title:"In Progress" , count:ldCount.in_prog , icon:"fa-solid fa-suitcase" , color:"rgb(209, 215, 27)" },
            { title:"Won Leads" , count:ldCount.won_ld , icon:"fa-solid fa-shield-heart" , color:"rgb(10, 152, 110)" },
            { title:"Lost Leads" , count:ldCount.lost_ld , icon:"fa-solid fa-heart-crack" , color:"rgb(249, 65, 65)" }
          ].map((item , idx)=>(
            <CountCard key={idx} title={item.title} count={item.count} iconClass={item.icon} color={item.color}/>
          ))
        }

        <TotalRevenueCard total={totalRevenue}/>

      </div>

      <hr/>

      <div>

        <h4><u>All Leads</u></h4>

        {
          leadData.length === 0 ?

          <div className="text-center text-muted mt-4">
            No leads available. Create your first lead.
          </div>

          :
        <div style={{overflowX:"scroll"}}>  
          <LeadsTable leads={leadData} handleStatusColor={handleStatusColor} basePath="/staff"/> 
      </div>

        }

      </div>

    </div>
  )
}

export default StaffDashboard