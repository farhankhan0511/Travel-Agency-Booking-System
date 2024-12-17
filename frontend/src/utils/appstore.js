import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"
import allpackagesReducer from "./AllPackagesSlice"
import tobookReducer from "./tobookSlice"
import accesstokenReducer from "./accesstokenSlice"

const appstore=configureStore({
    reducer:{
        user:userReducer,
        allpackages:allpackagesReducer,
        tobook:tobookReducer,
        accesstoken:accesstokenReducer
       
    }
})

export default appstore

