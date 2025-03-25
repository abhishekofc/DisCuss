import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from "./../components/Navbar"
import SocketListener from '../SocketListener'

const Mainlayout = () => {
  return (
    <div className='px-4  md:px-8 lg:px-16 xl:px-32 '>
       <Navbar/>
       <SocketListener/>
       <Outlet/>       
    </div>
  )
}

export default Mainlayout