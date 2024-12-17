import React, { useEffect } from 'react'
import { cloudinaryurl, url } from '../utils/constant';
import { Post } from '../utils/Post';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addtobook } from '../utils/tobookSlice';

const TourCardComponent = (props) => {

   

    const {tour}=props;
    const user=useSelector((store)=>store?.user)
    const dispatch=useDispatch()
    const navigate=useNavigate()
    

    const handleBookings=()=>{
        if(!user){
            navigate("/signin")
        }
        else{
            dispatch(addtobook(tour))
            navigate(`/book/${tour._id}`)
        }

       
    }
  return (
    <div className=' bg-[#F5F5DC] h-auto flex flex-col m-2 rounded-lg hover:bg-gray-200 hover:scale-105 hover:cursor-pointer' >
        <img className="w-full h-[50%] rounded-lg" src={cloudinaryurl+tour?.Image} alt={tour?.Title}/>
        <h1 className='text-lg font-bold'>{tour?.Title}</h1>
        {/* <h1 className='font-normal'>{tour?.Description}</h1> */}
        <h1 className='font-bold'>Availibility: {tour?.Availability}</h1>
        <h1 className='font-bold'>Available Dates: {tour?.Available_dates?.start.slice(0,10)} to {tour?.Available_dates?.end.slice(0,10)}</h1>
        <div className='flex justify-between p-2'>
        <h1 className='font-bold'>Price:{tour?.Price}</h1>
        <button className='bg-slate-800 rounded-md w-1/4  text-white hover:bg-slate-700' onClick={handleBookings}>Book</button>
    
        </div>
        </div>
  )
}

export default TourCardComponent