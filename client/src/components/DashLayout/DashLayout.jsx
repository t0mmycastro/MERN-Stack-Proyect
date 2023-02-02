import React from 'react'
import { Outlet } from 'react-router-dom'
import DashFooter from '../DashFooter/DashFooter'
import DashHeader from '../DashHeader/DashHeader'

const DashLayout = () => {
  return (
    <>
        <DashHeader />
        <div className='dash-container'>
            <Outlet />
        </div>
        <DashFooter />
    </>
  )
}

export default DashLayout