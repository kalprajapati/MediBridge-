import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className = ''>
      <Header/>
      <SpecialityMenu/>
      <TopDoctors/>
      <Banner/>
      <Footer/>
    </div>
  )
}

