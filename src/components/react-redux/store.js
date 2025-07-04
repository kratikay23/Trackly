import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./UserSlice"

const store = configureStore({
    reducer :{
        userData : UserReducer
    }
})

export default store;