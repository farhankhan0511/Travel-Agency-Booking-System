import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addpackages } from "../utils/AllPackagesSlice";
import { url } from "../utils/constant";
import { Get } from "../utils/Get";

export const useTourPackage=()=>{
    const dispatch=useDispatch()
    const fetchdata=async()=>{
    const data= await Get(url+"all")
    console.log(data)
       dispatch(addpackages(data?.data))
}
     useEffect(()=>{
        fetchdata()
     },[])
}
