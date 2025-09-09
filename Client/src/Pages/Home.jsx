import React from 'react'
import Navbar from '../Components/Navbar'
import Header from '../Components/Header'

export default function Home() {
  return (
    <div className='bg-[url("/bg_img.png")] min-h-screen bg-center'>
      <Navbar/>
      <Header/>
    </div>
  )
}
