import { TOrder } from '@utils-types';
import getFeedReducer, {
  getFeed,
  getUserOrders,
  initialState
} from './feedSlice';

describe('тесты редьюсера ленты заказов', () => {
  const mockOrders: TOrder[] = [
    {
      _id: '1',
      status: '',
      name: '',
      createdAt: '',
      updatedAt: '',
      number: 1,
      ingredients: []
    },
    {
      _id: '2',
      status: '',
      name: '',
      createdAt: '',
      updatedAt: '',
      number: 2,
      ingredients: []
    }
  ];

  describe('изменение состояния при запросе getFeed', () => {
    test('изменения при ожидании ответа', () => {
      const action = { type: getFeed.pending.type };
      const resultState = getFeedReducer(initialState, action);

      expect(resultState.loading).toBe(true);
      expect(resultState.error).toBe(null);
    });

    test('изменения при ответе с ошибкой', () => {
      const action = {
        type: getFeed.rejected.type,
        error: { message: 'ошибка' }
      };
      const resultState = getFeedReducer(initialState, action);

      expect(resultState.loading).toBe(false);
      expect(resultState.error).toBe('ошибка');
    });

    test('изменения при успешном ответе', () => {
      const action = {
        type: getFeed.fulfilled.type,
        payload: { orders: mockOrders, total: 100, totalToday: 1 }
      };
      const resultState = getFeedReducer(initialState, action);

      expect(resultState.loading).toBe(false);
      expect(resultState.orders).toEqual(mockOrders);
      expect(resultState.total).toBe(100);
      expect(resultState.totalToday).toBe(1);
    });
  });

  describe('изменение состояния при запросе getUserOrders', () => {
    test('изменения при ответе с ошибкой', () => {
      const action = {
        type: getUserOrders.rejected.type,
        error: { message: 'ошибка' }
      };
      const resultState = getFeedReducer(initialState, action);

      expect(resultState.userOrdersError).toBe('ошибка');
    });

    test('изменения при успешном ответе', () => {
      const action = {
        type: getUserOrders.fulfilled.type,
        payload: mockOrders
      };

      const resultState = getFeedReducer(initialState, action);

      expect(resultState.userOrders).toEqual(mockOrders);
    });
  });
});
