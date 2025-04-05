import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type TIngridientsState = {
  ingridients: Array<TIngredient>;
  loading: boolean;
  error: string | null;
};

const initialState: TIngridientsState = {
  ingridients: [],
  loading: false,
  error: null
};

export const getIngredients = createAsyncThunk('ingridients', async () =>
  getIngredientsApi()
);

export const ingridientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    ingridientsSelector: (state) => state.ingridients
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        action.error.message && (state.error = action.error.message);
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingridients = action.payload;
      });
  }
});

export const { ingridientsSelector } = ingridientSlice.selectors;
