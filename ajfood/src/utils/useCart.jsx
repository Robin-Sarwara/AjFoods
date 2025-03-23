import React, { useEffect } from 'react'
import { useState } from 'react'
import axiosInstance from './axiosInstance';
import { showErrorToast } from './toastMessage';

const useCart = (userId) => {
    const [cart, setCart] = useState({id:"",items:[]});

    const fetchCart = async()=>{
        try {
            const response = await axiosInstance.get(`/${userId}/cart-items` )
            setCart({id:response.data._id,items:response.data.items})
        } catch (error) {
            showErrorToast("Error fetching cart items")
        }
    }

    useEffect(() => {
      if(userId)fetchCart();
    }, [userId])
    

    const cartItemCount = cart.items.length
    
  return {cart, cartItemCount, fetchCart }
}

export default useCart