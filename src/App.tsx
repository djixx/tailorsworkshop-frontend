import Workflow from './components/Workflow'
import './App.css'
import FeatureSection from './components/FeatureSection'
import HeroSection from './components/HeroSection'
import Navbar from './components/Navbar'
import Testimonial from './components/Testimonial'
import Footer from './components/Footer'
import bg1 from "../src/assets/bg2.jpg"
function App() {

  return (
    <>
      <Navbar />
      <div
        className=" h-screen w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${bg1})` }}
      >
        <div className='max-w-7xl mx-auto pt-20 px-6'>
          <HeroSection />
        </div>
        <FeatureSection />
        <Workflow />
        <Testimonial />
        <Footer />
      </div>


    </>
  )
}

export default App
