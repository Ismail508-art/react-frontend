
import Navbar from './Components/Navbar/Navbar'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import LoginSignup from './pages/LoginSignup'
import Home from './pages/Home'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Appointment from './pages/Appointment'
import About from './pages/About'
import Login from './pages/Login'
 import ResetPassword from './pages/ResetPassword'
 import ForgotPassword from './pages/ForgotPassword'
import AdminDashboard from './pages/AdminDashboard'
function App (){
  return (
    <div >
    <BrowserRouter>
    <Navbar/>
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/signup' element={<LoginSignup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/products' element={<Product/>}/>
        <Route path='/appointment' element={<Appointment/>}/>
        <Route path='/aboutus' element={<About/>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
    </BrowserRouter>
    </div>
  )
  
}

export default App
