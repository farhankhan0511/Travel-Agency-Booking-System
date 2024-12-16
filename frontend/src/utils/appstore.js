import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"
import allpackagesReducer from "./AllPackagesSlice"

const appstore=configureStore({
    reducer:{
        user:userReducer,
        allpackages:allpackagesReducer,
       
    }
})

export default appstore

