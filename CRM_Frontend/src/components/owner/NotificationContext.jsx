import React , { createContext , useState , useEffect } from "react";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {

  const [notifications , setNotifications] = useState({
    unassigned_staff_count : 0
  });

  const token = localStorage.getItem("token");

  const fetchNotifications = async ()=>{

    let res = await fetch("http://127.0.0.1:8000/management/notifications",{
      headers:{
        Authorization:`Bearer ${token}`
      }
    });

    let data = await res.json();

    if(res.ok){
      setNotifications(data);
    }

  }

  useEffect(()=>{
    fetchNotifications();
  },[])

  return (
    <NotificationContext.Provider value={{ notifications , fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}