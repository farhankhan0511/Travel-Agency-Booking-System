import { createSlice } from "@reduxjs/toolkit";


const tobookSlice=createSlice({
    name:'tobook',
    initialState:null,
    reducers:{
        addtobook:(state,action)=>{
            return action.payload
        },
        removetobook:(state,action)=>{
            return null
        }
    }
})

export const {addtobook,removetobook}=tobookSlice.actions
export default tobookSlice.reducer
