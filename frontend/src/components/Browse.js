import React from 'react'
import Header from './Header'
import { useSelector } from 'react-redux';
import { useTourPackage } from '../Hooks/useTourPackages';
import TourPackage from './TourPackage';

const Browse = () => {
  useTourPackage()
  let packages=useSelector((store)=>store?.allpackages)
  return <>
    <div className='bg-gray-950'>
    {
    packages?.map((pack)=>(
       <TourPackage package={pack} />
    ))
     }

      
    </div>
    </>
  
}

export default Browse