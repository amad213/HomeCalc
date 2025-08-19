import React from 'react'
import Header from './Components/Header.jsx'
import Footer from './Components/Footer.jsx'
import Hero from './Calculators/Hero.jsx'
import BrickCalculator from './Calculators/BrickCalculator.jsx'
 

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Page Content */}
      <Hero/>
      <div>
      <BrickCalculator/>
      </div>
      {/* Footer (Sticky Bottom) */}
      <Footer />
       
    </div>
  )
}

export default App
