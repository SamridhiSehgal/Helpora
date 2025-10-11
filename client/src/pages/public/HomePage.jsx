import React from 'react'
import Hero from '../../components/Hero/Hero'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import HowItWorks from '../../components/HowItWorks/HowItWorks'
import OurMission from '../../components/OurMission/OurMission'

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <HowItWorks />
      <OurMission />
      <Footer />
    </div>
  )
}

export default HomePage
