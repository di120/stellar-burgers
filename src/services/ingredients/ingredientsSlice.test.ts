import { TIngredient } from "@utils-types";
import ingridientSliceReducer, { getIngredients, TIngridientsState } from "./ingridientsSlice";

describe('тесты редьюсера ингредиентов', () => {

    let initialState: TIngridientsState = {
      ingridients: [],
      loading: false,
      error: null
    };

    afterEach(() => {
        initialState = {
            ingridients: [],
            loading: false,
            error: null
          };
    });

    const mockIngredients: TIngredient[] = [
        {
            _id: '123',
            name: 'булочка',
            type: 'bun',
            proteins: 20,
            fat: 30,
            carbohydrates: 40,
            calories: 50,
            price: 1000,
            image: '',
            image_large: '',
            image_mobile: ''
        },
        {
            _id: '124',
            name: 'соус',
            type: 'sauce',
            proteins: 2,
            fat: 3,
            carbohydrates: 4,
            calories: 5,
            price: 100,
            image: '',
            image_large: '',
            image_mobile: ''
        },
        {
            _id: '125',
            name: 'котлета',
            type: 'main',
            proteins: 50,
            fat: 40,
            carbohydrates: 30,
            calories: 500,
            price: 2000,
            image: '',
            image_large: '',
            image_mobile: ''
        }
    ]

    describe('изменение состояния при запросе getIngredients', () => {
        test('изменения при ожидании ответа', () => {
            const action = {type: getIngredients.pending.type};
            const resultState = ingridientSliceReducer(initialState, action);

            expect(resultState.loading).toBe(true);
            expect(resultState.error).toBe(null);
        });
        test('изменения при ответе с ошибкой', () => {
            const action = {type: getIngredients.rejected.type, error: {message: 'ошибка'}};
            const resultState = ingridientSliceReducer(initialState, action);

            expect(resultState.loading).toBe(false);
            expect(resultState.error).toBe('ошибка');
        });
        test('изменения при успешном ответе', () => {
            const action = {type: getIngredients.fulfilled.type, payload: mockIngredients};
            const resultState = ingridientSliceReducer(initialState, action);

            expect(resultState.loading).toBe(false);
            expect(resultState.ingridients).toEqual(mockIngredients);
        });

    })
})
