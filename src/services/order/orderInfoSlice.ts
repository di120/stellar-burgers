import { getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';

export type TOrderInfoState = {
  order: TOrder[];
  loading: boolean;
  error: string | null;
};

const initialState: TOrderInfoState = {
  order: [],
  loading: false,
  error: null
};

export const getOrderInfo = createAsyncThunk(
  '/orders/number',
  async (number: number) => getOrderByNumberApi(number)
);

export const orderInfoSlice = createSlice({
  name: '/orders/number',
  initialState,
  reducers: {
    orderReset: (state) => {
      state.order = [];
    }
  },
  selectors: {
    orderInfoSelector: (state) => state.order[0],
    orderNumberSelector: (state) => {
      if (!state.order[0] && state.loading) return 'Загрузка...';
      if (!state.order[0] && !state.loading) return null;
      return state.order[0].number;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderInfo.rejected, (state, action) => {
        state.loading = false;
        action.error.message && (state.error = action.error.message);
      })
      .addCase(getOrderInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.orders;
      });
  }
});

export const { orderInfoSelector, orderNumberSelector } =
  orderInfoSlice.selectors;

export const { orderReset } = orderInfoSlice.actions;

export default orderInfoSlice.reducer;
