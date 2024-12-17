import React from 'react'
import { cloudinaryurl, url } from '../utils/constant';
import { Post } from '../utils/Post';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const TourCardComponent = (props) => {
    const {tour}=props;
    const user=useSelector((store)=>store?.user)
    const navigate=useNavigate()
    

    const handleBookings=()=>{
        if(!user){
            navigate("/signin")
        }
        else{
            navigate(`/book/${tour._id}`)
        }

       
    }
  return (
    <div className=' bg-gray-500 h-auto flex flex-col m-2 rounded-lg hover:bg-gray-400 hover:scale-95 hover:cursor-pointer' >
        <img className="w-full h-[50%] rounded-lg" src={cloudinaryurl+tour?.Image} alt={tour?.Title}/>
        <h1 className='text-lg font-bold'>{tour?.Title}</h1>
        <h1 className='hidden'>{tour?.Description}</h1>
        <h1 className='font-bold'>Availibility: {tour?.Availability}</h1>
        <h1 className='font-bold'>Available Dates: {tour?.Available_dates?.start.slice(0,10)} to {tour?.Available_dates?.end.slice(0,10)}</h1>
        <h1 className='font-bold'>Price:{tour?.Price}</h1>
        <button className='bg-slate-800 rounded-md w-1/4 ml-auto m-2 p-1 text-white hover:bg-slate-700' onClick={handleBookings}>Book</button>
    </div>
  )
}

export default TourCardComponent