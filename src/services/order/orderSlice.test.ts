import { TOrder } from '@utils-types';
import orderInfoSliceReducer, {
  TOrderInfoState,
  getOrderInfo,
  orderReset
} from './orderInfoSlice';

describe('тесты редьюсера заказа', () => {
  let initialState: TOrderInfoState = {
    order: [],
    loading: false,
    error: null
  };

  const mockOrderInfo: TOrder[] = [
    {
      _id: '1',
      status: 'в работе',
      name: 'имя заказа',
      createdAt: '',
      updatedAt: '',
      number: 1,
      ingredients: []
    }
  ];

  let stateWithOrder: TOrderInfoState = {
    order: mockOrderInfo,
    loading: false,
    error: null
  };

  afterAll(() => {
    initialState = {
      order: [],
      loading: false,
      error: null
    };

    stateWithOrder = {
        order: mockOrderInfo,
        loading: false,
        error: null
      };
  });

  test('сброс информации о заказе', () => {
    const resultState = orderInfoSliceReducer(stateWithOrder, orderReset())
    expect(resultState.order.length).toBe(0);
  });

  describe('изменение состояния при запросе getOrderInfo', () => {
    test('изменения при ожидании ответа', () => {
        const action = {type: getOrderInfo.pending.type};
        const resultState = orderInfoSliceReducer(initialState, action);

        expect(resultState.loading).toBe(true);
        expect(resultState.error).toBe(null);
    });
    test('изменения при ответе с ошибкой', () => {
        const action = {type: getOrderInfo.rejected.type, error: {message: 'ошибка'}};
        const resultState = orderInfoSliceReducer(initialState, action);

        expect(resultState.loading).toBe(false);
        expect(resultState.error).toBe('ошибка');
    });

    test('изменения при успешном ответе', () => {
        const action = {type: getOrderInfo.fulfilled.type, payload: {orders: mockOrderInfo} };
        const resultState = orderInfoSliceReducer(initialState, action);

        expect(resultState.loading).toBe(false);
        expect(resultState.order).toEqual(mockOrderInfo);
    });
  });
});
