import { useEffect, useState, useCallback } from 'react'
import axiosInstance from './axiosInstance';
import { showErrorToast } from './toastMessage';

const useCart = (userId) => {
    const [cart, setCart] = useState({id:"",items:[]});

    const fetchCart = useCallback(async()=>{
        try {
            const response = await axiosInstance.get(`/${userId}/cart-items` )
            setCart({id:response.data._id,items:response.data.items})
        } catch (error) {
            showErrorToast(error?.response?.data?.error || "Error fetching cart items")
        }
    }, [userId])

    useEffect(() => {
      if(userId)fetchCart();
    }, [userId, fetchCart])
    

    const cartItemCount = cart.items.length
    
  return {cart, cartItemCount, fetchCart }
}

export default useCart