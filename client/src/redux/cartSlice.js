import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { serverUrl } from "../App";

const initialState = {
  items: [],
  restaurant: null,
  totalAmount: 0,
  loading: false,
  error: null,
  conflict: null,
};

// Fetch current cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${serverUrl}/api/cart`, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart",
      );
    }
  },
);

// Add item to cart
export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ menuItemId, quantity, note, replaceCart }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${serverUrl}/api/cart/items`,
        { menuItemId, quantity, note, replaceCart },
        { withCredentials: true },
      );
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 409) {
        return rejectWithValue({
          conflict: true,
          message: error.response.data.message,
          menuItemId,
          quantity,
          note,
        });
      }

      return rejectWithValue({
        conflict: false,
        message: error.response?.data?.message || "Failed to add item to cart",
      });
    }
  },
);

// Update item quantity
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${serverUrl}/api/cart/items/${itemId}`,
        { quantity },
        { withCredentials: true },
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update item",
      );
    }
  },
);

// Remove item from cart
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${serverUrl}/api/cart/items/${itemId}`,
        { withCredentials: true },
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item",
      );
    }
  },
);

// Clear entire cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${serverUrl}/api/cart`, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart",
      );
    }
  },
);

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    resetCartState: (state) => {
      state.items = [];
      state.restaurant = null;
      state.totalAmount = 0;
      state.error = null;
      state.conflict = null;
    },

    clearConflict: (state) => {
      state.conflict = null;
    },
  },

  extraReducers: (builder) => {
    const setCartData = (state, payload) => {
      state.items = payload.items || [];
      state.restaurant = payload.restaurant || null;
      state.totalAmount = payload.totalAmount || 0;
      state.loading = false;
      state.error = null;
    };

    builder
      // Fetch
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        setCartData(state, action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.conflict = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        setCartData(state, action.payload);
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;

        if (action.payload?.conflict) {
          state.conflict = action.payload;
        } else {
          state.error = action.payload?.message || action.payload;
        }
      })

      // Update quantity
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        setCartData(state, action.payload);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Remove item
      .addCase(removeCartItem.fulfilled, (state, action) => {
        setCartData(state, action.payload);
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Clear cart
      .addCase(clearCart.fulfilled, (state, action) => {
        setCartData(state, action.payload);
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetCartState, clearConflict } = cartSlice.actions;

export default cartSlice.reducer;