import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {Get} from "../utils/Get.js"
import {url} from "../utils/constant.js"
import { removeUser } from '../utils/userSlice'
import { useNavigate } from 'react-router-dom'


const Header = () => {
    const dispatch=useDispatch()
    const user=useSelector((store)=>store?.user)
    const navigate=useNavigate()
    

    const handleadmindashboard=()=>{

    }
    const handleAuth=()=>{
        if(user){
            const handlelogout=async()=>{const logout=async()=>{let data=await Get(url+"user/logout")}; logout();}
            handlelogout()
            dispatch(removeUser())
            navigate("/browse")
        }
        else{
            navigate("/signin")
        }
    }

  return (
    <div className=' flex  w-full py-[2%]  bg-black bg-gradient-to-r justify-between'>
        <h1 className='ml-3 text-xl font-bold text-white'>Travel Agency Booking System</h1>
        <div className='flex justify-around px-4'>
            
    {user?.isadmin && <button className='text-white mx-2' onClick={handleadmindashboard}>Dashboard</button>
    }
    <button className='text-white mx-2' onClick={handleAuth}>{user?"Signout":"Signup"}</button>
        </div>
    </div>
  )
}

export default Header