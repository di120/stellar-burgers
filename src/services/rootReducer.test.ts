import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './store';
import orderSliceReducer from './order/orderInfoSlice';
import burgerSliceReducer from './constructor/burgerSlice';
import feedSliceReducer from './feed/feedSlice';
import ingridientsSliceReducer from './ingredients/ingridientsSlice';
import userSliceReducer from './user/userSlice';

const initialStoreExpected = {
  '/orders/number': {
    error: null,
    loading: false,
    order: []
  },
  burger: {
    buns: null,
    burgerIngredients: [],
    ingridientsCount: 0,
    orderError: null,
    orderInfo: null,
    orderRequest: false
  },
  feed: {
    error: null,
    loading: false,
    orders: [],
    total: 0,
    totalToday: 0,
    userOrders: [],
    userOrdersError: null
  },
  ingredients: {
    error: null,
    ingridients: [],
    loading: false
  },
  user: {
    isAuthChecked: false,
    loginUserError: null,
    loginUserRequest: false,
    logoutUserError: null,
    registerUserError: null,
    updateUserError: null,
    user: null
  }
};

test('правильная инициализация rootReducer', () => {
  const mockStore = configureStore({
    reducer: rootReducer
  });

  expect(mockStore.getState()['/orders/number']).toEqual(
    orderSliceReducer(undefined, { type: '' })
  );
  expect(mockStore.getState().burger).toEqual(
    burgerSliceReducer(undefined, { type: '' })
  );
  expect(mockStore.getState().feed).toEqual(
    feedSliceReducer(undefined, { type: '' })
  );
  expect(mockStore.getState().ingredients).toEqual(
    ingridientsSliceReducer(undefined, { type: '' })
  );
  expect(mockStore.getState().user).toEqual(
    userSliceReducer(undefined, { type: '' })
  );

  expect(rootReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(initialStoreExpected);
});
