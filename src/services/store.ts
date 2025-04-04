import { combineSlices, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingridientSlice } from './ingridientsSlice';
import { feedSlice } from './feedSlice';
import { orderInfoSlice } from './orderInfoSlice';
import { userSlice } from './userSlice';
import { burgerSlice } from './burgerSlice';

const rootReducer = combineSlices(
  ingridientSlice,
  feedSlice,
  orderInfoSlice,
  userSlice,
  burgerSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
