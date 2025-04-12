import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/footer'

const MainLayout = ({children}) => {
  return (
    <>
    <Navbar/>
    <main className='pt-16'>{children}</main>
    <Footer/> 
    </>
  )
}

export default MainLayout