import { createSlice } from "@reduxjs/toolkit";


const accesstokenSlice=createSlice({
    name:'accesstoken',
    initialState:null,
    reducers:{
        addaccesstoken:(state,action)=>{
            return action.payload
        },
        removeaccesstoken:(state,action)=>{
            return null
        }
    }
})

export const {addaccesstoken,removeaccesstoken}=accesstokenSlice.actions
export default accesstokenSlice.reducer
