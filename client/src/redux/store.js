import { configureStore, createReducer } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import ownerReducer from "./ownerSlice";
import cartReducer from "./cartSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    owner: ownerReducer,
    cart: cartReducer,
  },
});

export default store;