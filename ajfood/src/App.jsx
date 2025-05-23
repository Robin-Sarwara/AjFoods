import { useState } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from "./components/Login"
import Signup from "./components/Signup"
import Home from "./components/Home"
import RefreshHandler from './utils/RefreshHandler'
import ForgetPass from './components/ForgetPass'
import PasswordReset from './components/PasswordReset'
import MainLayout from './layout/MainLayout'
import About from './components/About'
import Contact from './components/Contact'
import FAQ from './components/FAQ'
import AddProduct from './components/AddProduct'
import Carousel from './components/Carousel'
import ProductInfo from './components/ProductInfo'
import { RoleProvider } from './utils/RoleContext'
import { ToastContainer } from 'react-toastify'
import ProductQuestion from './components/ProductQuestion'
import UserAllAskedQues from './components/UserAllAskedQues'
import AllReviews from './components/AllReviews'
import Cart from './components/Cart'
import Orders from './components/Orders'
import OrderManager from './components/OrderManager'
import Profile from './components/Profile'
import TermsAndCondition from './components/TermsAndCondition'
import EditProfile from './components/EditProfile'
import UpdateEmail from './components/UpdateEmail'
import AddDeliveryAddress from './components/AddDeliveryAddress'
import SearchedFood from './components/SearchedFood'


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const PrivateRoute = ({element})=>{
    return isAuthenticated ? element: <Navigate to="/home" />
  }

  return (
    <div>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated}/>
      <ToastContainer/>
      <RoleProvider>
      <Routes>
        <Route path = "/" element={<Navigate to= "/home"/>} /> 
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/home" element={<MainLayout><Home/></MainLayout>}/>
        <Route path="/forget-pass" element={<ForgetPass/>}/>
        <Route path="/reset-password" element={<PasswordReset/>}/>
        <Route path ="/about-us" element ={<MainLayout><About/></MainLayout>}/>
        <Route path ="/contact-us" element ={<MainLayout><Contact/></MainLayout>}/>
        <Route path ="/faqs" element ={<MainLayout><FAQ/></MainLayout>}/>
        <Route path="/add-product" element={<AddProduct/>}/>
        <Route path="/home" element={<Carousel/>}/>
        <Route path="/product/:id" element={<MainLayout> <ProductInfo/> </MainLayout> }/>
        <Route path="/all-questions/:id" element={<ProductQuestion/>}/>
        <Route path="/user-all-questions" element={<UserAllAskedQues/>}/>
        <Route path="/all-reviews/:id" element={<AllReviews/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/order" element={<Orders/>}/>
        <Route path="/order-manager" element={<OrderManager/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/terms-and-condtions" element={<TermsAndCondition/>}/>
        <Route path="/edit-profile" element={<EditProfile/>}/>
        <Route path="/update-email" element={<UpdateEmail/>}/>
        <Route path="/delivery-address/add" element={<AddDeliveryAddress/>}/>
        <Route path="/search" element={<MainLayout> <SearchedFood/> </MainLayout>}/>

      </Routes>
      </RoleProvider>
    </div>
  )
}

export default App
