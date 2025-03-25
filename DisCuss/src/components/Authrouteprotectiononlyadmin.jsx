import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Authrouteprotectiononlyadmin = () => {
  const user=useSelector((state=>state.user))
  if(user && user.isLoggedin && user.user.role==="admin"){
    return (<Outlet/>)
  }
  else{
    return <Navigate to="/login"/>
  }
}

export default Authrouteprotectiononlyadmin