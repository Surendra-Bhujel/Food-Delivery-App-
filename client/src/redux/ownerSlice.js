import { createSlice } from "@reduxjs/toolkit";

const ownerSlice = createSlice({
  name: "owner",

  initialState: {
    restaurant: null,
  },

  reducers: {
    setRestaurant: (state, action) => {
      state.restaurant = action.payload;
    },

    clearRestaurant: (state) => {
      state.restaurant = null;
    },
  },
});

export const { setRestaurant, clearRestaurant } = ownerSlice.actions;

export default ownerSlice.reducer;