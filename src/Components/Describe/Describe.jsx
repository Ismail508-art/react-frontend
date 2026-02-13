import logo from '../Assets/logo.png'
import './Describe.css'

const Describe = () => {
  
  return (
    <div className='description'>

      <div className='left-desc'>
        <h2>Your body's ability to heal is greater than you know</h2>

        <p className="one-stop-text">
          One Stop Solution for Physiotherapy, Cupping, Diet & Lab Tests
        </p>
         
      </div>

      <div className='right-desc'>
        <img src={logo} alt="Clinic Logo" height="300" width="400" />
          

      </div>

    </div>
  )
}

export default Describe
