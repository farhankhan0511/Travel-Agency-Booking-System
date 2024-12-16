import { createSlice } from "@reduxjs/toolkit";


const allpackagesSlice=createSlice({
    name:'allpackages',
    initialState:null,
    reducers:{
        addpackages:(state,action)=>{
            return action.payload
        },
        removepackages:(state,action)=>{
            return null
        }
    }
})

export const {addpackages,removepackages}=allpackagesSlice.actions
export default allpackagesSlice.reducer
