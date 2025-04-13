import { getFeedsApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
  userOrders: TOrder[];
  userOrdersError: string | null;
};

export const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null,
  userOrders: [],
  userOrdersError: null
};

export const getFeed = createAsyncThunk('/orders/all', async () =>
  getFeedsApi()
);

export const getUserOrders = createAsyncThunk('/orders/byUser', async () =>
  getOrdersApi()
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    ordersSelector: (state) => state.orders,
    totalSelector: (state) => state.total,
    totalTodaySelector: (state) => state.totalToday,
    userOrdersSelector: (state) => state.userOrders
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.loading = false;
        action.error.message && (state.error = action.error.message);
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        action.error.message && (state.userOrdersError = action.error.message);
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      });
  }
});

export const {
  ordersSelector,
  totalSelector,
  totalTodaySelector,
  userOrdersSelector
} = feedSlice.selectors;

export default feedSlice.reducer;
