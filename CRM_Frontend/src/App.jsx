import React from 'react'
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import { NotificationProvider } from './components/owner/NotificationContext'
import ManagerDashboard from './components/manager/ManagerDashboard'
import ProtectedRoute  from "./components/routes/ProtectedRoute"
import StaffLayout from './components/staff/StaffLayout'
import StaffDashboard from './components/staff/StaffDashboard'
import StaffCustomers from './components/staff/StaffCustomer'
import ManagerLayout from './components/manager/ManagerLayout'
import StageDisplay from './components/manager/StageDisplay'
import ManagerConfiguration from './components/manager/ManagerConfiguration'
import OwnerLayout from './components/owner/OwnerLayout'
import OwnerDashboard from './components/owner/OwnerDashboard'
import ServiceDisplay from './components/manager/ServiceDisplay'
import CustomerCategory from './components/manager/CustomerCategory'
import CreateCustomer from './components/staff/CreateCustomer'
import CreateLead from './components/staff/CreateLead'
import StaffDetailView from './components/staff/StaffDetailView'
import StaffLeadView from './components/staff/StaffLeadView'
import StaffAnalysis from './components/staff/StaffAnalysis'
import AssignManager from './components/owner/AssignManager'
import AllStaff from './components/owner/AllStaff'
import OwnerLeadView from './components/owner/OwnerLeadView'
import ManagerCustomersPage from './components/manager/ManagerCustomersPage'
import ManagerLeadView from './components/manager/ManagerLeadView'

function App() {
  return (
    
    <NotificationProvider>
  
      <Router>
  
        <Routes>
  
        <Route path='/register' element={
          <>
            <Register/>
          </>
        }/>
  
        <Route path='/' element={
          <>
          <Login/>
          </>
        } />
  
        <Route  path="/staff" element=
          {
            <ProtectedRoute allowedrole={"staff"}>
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path='customers' element={<StaffCustomers/>} />
          <Route path='create/customer' element={<CreateCustomer/>} />
          <Route path='create-lead' element={<CreateLead/>} />
          <Route path=':id/customer' element={<StaffDetailView/>} />
          <Route path=':id/lead' element={<StaffLeadView/>} />
          <Route path='analysis' element={<StaffAnalysis/>} />
        </Route>
  
        <Route  path="/manager" element=
        {
          <ProtectedRoute allowedrole={"manager"}>
            <ManagerLayout />
          </ProtectedRoute>
        } >
  
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="configuration" element={<ManagerConfiguration />} />
          <Route path='stages' element={<StageDisplay/>} />
          <Route path='services' element={<ServiceDisplay/>} />
          <Route path='categories' element={<CustomerCategory/>} />
          <Route path='customers' element={<ManagerCustomersPage/>} />
          <Route path=':id/lead' element={<ManagerLeadView/>} />
  
        </Route>
  
       <Route path="/owner" element={
          <ProtectedRoute allowedrole={"management"}>
            <OwnerLayout />
          </ProtectedRoute>
        }>
  
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path=":id/lead" element={<OwnerLeadView />} />
            <Route path="assign-manager" element={<AssignManager />} />
            <Route path="staffs" element={<AllStaff />} />
  
        </Route>
  
        <Route path='/stages' element={<StageDisplay/>} />
  
        </Routes>
      </Router>
      
    </NotificationProvider>
  )
}

export default App