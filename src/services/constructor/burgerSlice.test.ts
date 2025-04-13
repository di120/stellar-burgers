import { afterEach } from 'node:test';
import burgerSliceReducer, {
  addIngredient,
  moveDown,
  moveUp,
  removeIngredient,
  resetConstructor,
  TBurgerState,
  orderBurger,
  initialState as initialEmpty
} from './burgerSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

describe('тесты редьюсера конструктора бургера', () => {
  const bunMock: TIngredient = {
    _id: '1',
    name: 'булка',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1000,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  };

  const bunConstructorMock: TConstructorIngredient = {
    _id: '1',
    id: '1',
    name: 'булка',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1000,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  };

  const ingredientMock: TIngredient = {
    _id: '2',
    name: 'соус',
    type: 'sauce',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 99,
    price: 100,
    image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png'
  };

  const ingredientConstructorMock1: TConstructorIngredient = {
    _id: '2',
    id: '2',
    name: 'соус',
    type: 'sauce',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 99,
    price: 100,
    image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png'
  };

  const ingredientConstructorMock2: TConstructorIngredient = {
    _id: '3',
    id: '3',
    name: 'котлета',
    type: 'main',
    proteins: 200,
    fat: 200,
    carbohydrates: 53,
    calories: 500,
    price: 1500,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  };

  let initialWithIng: TBurgerState = {
    burgerIngredients: [ingredientConstructorMock1, ingredientConstructorMock2],
    buns: bunConstructorMock,
    ingridientsCount: 0,
    orderRequest: false,
    orderError: null,
    orderInfo: null
  };

  afterEach(() => {
    initialWithIng = {
      burgerIngredients: [
        ingredientConstructorMock1,
        ingredientConstructorMock2
      ],
      buns: bunConstructorMock,
      ingridientsCount: 0,
      orderRequest: false,
      orderError: null,
      orderInfo: null
    };
  });

  test('добавление булочки в конструкор', () => {
    const resultState = burgerSliceReducer(
      initialEmpty,
      addIngredient(bunMock)
    );
    const resultBun = resultState.buns;
    const expectedBun = { ...bunMock, id: expect.any(String) };

    const resultCount = resultState.ingridientsCount;
    console.debug(initialEmpty);

    expect(resultBun).toEqual(expectedBun);
    expect(resultCount).toBe(1);
  });

  test('добавление ингредиента в конструкор', () => {
    const resultState = burgerSliceReducer(
      initialEmpty,
      addIngredient(ingredientMock)
    );

    const resultIngredients = resultState.burgerIngredients;
    const expectedIngredient = { ...ingredientMock, id: expect.any(String) };

    expect(resultIngredients.length).toBe(1);
    expect(resultIngredients[0]).toEqual(expectedIngredient);
  });

  test('удаление ингредиента из конструктора', () => {
    const resultState = burgerSliceReducer(
      initialWithIng,
      removeIngredient(ingredientConstructorMock1.id)
    );

    const resultIngredients = resultState.burgerIngredients;
    const initialIngredientsLength = initialWithIng.burgerIngredients.length;

    expect(resultIngredients.length).toBe(initialIngredientsLength - 1);
  });

  test('перемещение ингредиента вверх', () => {
    const initialIndex = initialWithIng.burgerIngredients.length - 1;

    const resultState = burgerSliceReducer(
      initialWithIng,
      moveUp(initialIndex)
    );

    const ingBeforeMove = initialWithIng.burgerIngredients[initialIndex];
    const ingAfterMove = resultState.burgerIngredients[initialIndex - 1];

    expect(ingAfterMove).toEqual(ingBeforeMove);
  });

  test('перемещение ингредиента вниз', () => {
    const initialIndex = 0;

    const resultState = burgerSliceReducer(
      initialWithIng,
      moveDown(initialIndex)
    );

    const ingBeforeMove = initialWithIng.burgerIngredients[initialIndex];
    const ingAfterMove = resultState.burgerIngredients[initialIndex + 1];

    expect(ingAfterMove).toEqual(ingBeforeMove);
  });

  test('сброс состояния конструктора до начального', () => {
    const resultState = burgerSliceReducer(initialWithIng, resetConstructor());

    expect(resultState).toEqual(initialEmpty);
  });

  test('изменение состояния при ожидании ответа orderBurger', () => {
    const action = { type: orderBurger.pending.type };
    const resultState = burgerSliceReducer(initialEmpty, action);
    expect(resultState.orderRequest).toBe(true);
    expect(resultState.orderError).toBe(null);
  });

  test('изменение состояния при ответе orderBurger с ошибкой', () => {
    const action = {
      type: orderBurger.rejected.type,
      error: { message: 'ошибка' }
    };
    const resultState = burgerSliceReducer(initialEmpty, action);
    expect(resultState.orderError).toBe('ошибка');
    expect(resultState.orderRequest).toBe(false);
  });

  test('изменение состояния при успешном ответе orderBurger', () => {
    const mockOrderData = {
      _id: '1',
      status: '',
      name: '',
      createdAt: '',
      updatedAt: '',
      number: 1,
      ingredients: []
    };

    const action = {
      type: orderBurger.fulfilled.type,
      payload: { order: mockOrderData }
    };

    const resultState = burgerSliceReducer(initialEmpty, action);

    expect(resultState.orderRequest).toBe(false);
    expect(resultState.orderInfo).toEqual(mockOrderData);
  });
});
