import React from 'react'
import { useTourPackage } from '../Hooks/useTourPackages'
import { useSelector } from 'react-redux'
import TourCardComponent from './TourCardComponent'

const Browse = () => {
    useTourPackage();
    let Tourpackages=useSelector((store)=>store?.allpackages);


  return (
    <div className='grid grid-cols-12 m-2'>
        {
            Tourpackages?.map((tour,index)=>(
                <div className='col-span-3' key={index} >

                  {  tour?.isPublic && <TourCardComponent tour={tour} />}
                </div>
                
            ))
        }
    </div>
  )
}

export default Browse