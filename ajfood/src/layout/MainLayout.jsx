import React from 'react'
import Navbar from '../components/Navbar'

const MainLayout = ({children}) => {
  return (
    <>
    <Navbar/>
    <main className='pt-16'>{children}</main>
    </>
  )
}

export default MainLayout