import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './store';
import burgerSliceReducer, {
  initialState as initialBurgerState
} from './constructor/burgerSlice';
import feedSliceReducer, {
  initialState as initialFeedState
} from './feed/feedSlice';
import ingridientsSliceReducer, {
  initialState as initialIngredientsState
} from './ingredients/ingridientsSlice';
import userSliceReducer, {
  initialState as initialUserState
} from './user/userSlice';
import orderSliceReducer, {
  initialState as initialOrderState
} from './order/orderInfoSlice';

const initialStoreExpected = {
  '/orders/number': initialOrderState,
  burger: initialBurgerState,
  feed: initialFeedState,
  ingredients: initialIngredientsState,
  user: initialUserState
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

  expect(rootReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
    initialStoreExpected
  );
});
