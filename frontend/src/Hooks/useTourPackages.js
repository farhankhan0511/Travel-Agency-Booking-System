import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addpackages } from "../utils/AllPackagesSlice";

export const useTourPackage=()=>{
    const dispatch=useDispatch()
    const fetchdata=async()=>{
        const response=await fetch("http://localhost:3000/api/v1/all");
        const data=await response.json()
        if (!response.ok) {
         throw new Error(data.message || "An error occurred");
       }
       console.log(data)
       dispatch(addpackages(data))
     
     }


     useEffect(()=>{
        fetchdata()
     })
}
