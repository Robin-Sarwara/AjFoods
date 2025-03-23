import React from 'react'
import { FaStar } from 'react-icons/fa'

const StarRating = ({rating, onRatingChange }) => {
  return (
    <div className='flex'>
        {[1,2,3,4,5].map((star)=>(
            <FaStar
            key={star}
            className={`cursor-pointer ${star <= rating ? "text-yellow-500" : "text-gray-400" }`}
            size={30}
            onClick={()=>onRatingChange(star)}/>
        ))}
    </div>
  )
}

export default StarRating