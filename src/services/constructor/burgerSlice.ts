import { orderBurgerApi } from '@api';
import { BurgerIngredient } from '@components';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

export type TBurgerState = {
  burgerIngredients: TConstructorIngredient[];
  buns: TConstructorIngredient | null;
  ingridientsCount: number;
  orderRequest: boolean;
  orderError: string | null;
  orderInfo: TOrder | null;
};

const initialState: TBurgerState = {
  burgerIngredients: [],
  buns: null,
  ingridientsCount: 0,
  orderRequest: false,
  orderError: null,
  orderInfo: null
};

export const orderBurger = createAsyncThunk(
  'constructor/order',
  async (data: string[]) => await orderBurgerApi(data)
);

export const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.ingridientsCount++;
      const id = String(state.ingridientsCount);
      const newIngredient = { ...action.payload, id };
      if (newIngredient.type === 'bun') {
        state.buns = newIngredient;
      } else {
        state.burgerIngredients.push(newIngredient);
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.burgerIngredients = state.burgerIngredients.filter(
        (b) => b.id !== action.payload
      );
    },
    moveDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const newIndex = index + 1;
      [state.burgerIngredients[index], state.burgerIngredients[newIndex]] = [
        state.burgerIngredients[newIndex],
        state.burgerIngredients[index]
      ];
    },
    moveUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const newIndex = index - 1;
      [state.burgerIngredients[index], state.burgerIngredients[newIndex]] = [
        state.burgerIngredients[newIndex],
        state.burgerIngredients[index]
      ];
    },
    resetConstructor: () => initialState
  },
  selectors: {
    bunsSelector: (state) => state.buns,
    burgerIngredientsSelector: (state) => state.burgerIngredients,
    orderRequestSelector: (state) => state.orderRequest,
    orderInfoSelector: (state) => state.orderInfo,
    orderErrorSelector: (state) => state.orderError
  },
  extraReducers(builder) {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        action.error.message && (state.orderError = action.error.message);
        state.orderRequest = false;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderInfo = action.payload.order;
      });
  }
});

export const {
  bunsSelector,
  burgerIngredientsSelector,
  orderRequestSelector,
  orderInfoSelector,
  orderErrorSelector
} = burgerSlice.selectors;

export const {
  addIngredient,
  removeIngredient,
  moveDown,
  moveUp,
  resetConstructor
} = burgerSlice.actions;

export default burgerSlice.reducer;
