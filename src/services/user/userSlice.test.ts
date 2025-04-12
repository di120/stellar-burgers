import { TUser } from '@utils-types';
import userSliceReducer, {
  loginUser,
  logoutUser,
  registerUser,
  setIsAuthChecked,
  setUser,
  TUserState,
  updateUser
} from './userSlice';

describe('тесты редьюсера пользователя', () => {
  let mockUserData: TUser = {
    email: 'email@email',
    name: 'Name'
  };

  let mockUpdatedUserData: TUser = {
    email: 'NewEmail@email',
    name: 'NewName'
  }

  let initialEmptyState: TUserState = {
    isAuthChecked: false,
    user: null,
    loginUserError: null,
    loginUserRequest: false,
    registerUserError: null,
    logoutUserError: null,
    updateUserError: null
  };

  let initialStateWithUser: TUserState = {
    isAuthChecked: true,
    user: mockUserData,
    loginUserError: null,
    loginUserRequest: false,
    registerUserError: null,
    logoutUserError: null,
    updateUserError: null
  };

  let initialStateWithErrors: TUserState = {
    isAuthChecked: false,
    user: null,
    loginUserError: 'error',
    loginUserRequest: false,
    registerUserError: 'error',
    logoutUserError: 'error',
    updateUserError: 'error'
  };

  afterEach(() => {
    mockUserData = {
      email: 'email@email',
      name: 'Name'
    };

    initialEmptyState = {
      isAuthChecked: false,
      user: null,
      loginUserError: null,
      loginUserRequest: false,
      registerUserError: null,
      logoutUserError: null,
      updateUserError: null
    };

    initialStateWithUser = {
      isAuthChecked: true,
      user: mockUserData,
      loginUserError: null,
      loginUserRequest: false,
      registerUserError: null,
      logoutUserError: null,
      updateUserError: null
    };

    initialStateWithErrors = {
      isAuthChecked: false,
      user: null,
      loginUserError: 'error',
      loginUserRequest: false,
      registerUserError: 'error',
      logoutUserError: 'error',
      updateUserError: 'error'
    };
  });

  test('установка данных пользователя', () => {
    const resultState = userSliceReducer(
      initialEmptyState,
      setUser(mockUserData)
    );

    expect(resultState.user).toEqual(mockUserData);
  });
  test('установка значения isAuthChecked', () => {
    const resultState = userSliceReducer(
      initialEmptyState,
      setIsAuthChecked(true)
    );
    expect(resultState.isAuthChecked).toEqual(true);
  });
  describe('изменение состояния при запросе loginUser', () => {
    test('изменения при ожидании ответа', () => {
      const action = { type: loginUser.pending.type };
      const resultState = userSliceReducer(initialStateWithErrors, action);

      expect(resultState.loginUserError).toBe(null);
      expect(resultState.loginUserRequest).toBe(true);
    });
    test('изменения при ответе с ошибкой', () => {
      const action = {
        type: loginUser.rejected.type,
        error: { message: 'ошибка' }
      };
      const resultState = userSliceReducer(initialEmptyState, action);

      expect(resultState.loginUserError).toBe('ошибка');
      expect(resultState.loginUserRequest).toBe(false);
    });
    test('изменения при успешном ответе', () => {
      const action = { type: loginUser.fulfilled.type, payload: mockUserData };
      const resultState = userSliceReducer(initialEmptyState, action);

      expect(resultState.user).toEqual(mockUserData);
      expect(resultState.loginUserRequest).toBe(false);
    });
  });
  describe('изменение состояния при запросе registerUser', () => {
    test('изменения при ожидании ответа', () => {
      const action = { type: registerUser.pending.type };
      const resultState = userSliceReducer(initialStateWithErrors, action);

      expect(resultState.registerUserError).toBe(null);
      expect(resultState.loginUserRequest).toBe(true);
      expect(resultState.loginUserError).toBe(null);
    });
    test('изменения при ответе с ошибкой', () => {
      const action = {
        type: registerUser.rejected.type,
        error: { message: 'ошибка' }
      };
      const resultState = userSliceReducer(initialEmptyState, action);

      expect(resultState.registerUserError).toBe('ошибка');
      expect(resultState.loginUserRequest).toBe(false);
    });
    test('изменения при успешном ответе', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUserData
      };
      const resultState = userSliceReducer(initialEmptyState, action);

      expect(resultState.user).toEqual(mockUserData);
      expect(resultState.loginUserRequest).toBe(false);
    });
  });
  describe('изменение состояния при запросе logoutUser', () => {
    test('изменения при ответе с ошибкой', () => {
      const action = {
        type: logoutUser.rejected.type,
        error: { message: 'ошибка' }
      };
      const resultState = userSliceReducer(initialStateWithUser, action);

      expect(resultState.logoutUserError).toBe('ошибка');
    });
    test('изменения при успешном ответе', () => {
      const action = {
        type: logoutUser.fulfilled.type
      };
      const resultState = userSliceReducer(initialStateWithUser, action);

      expect(resultState.user).toBe(null);
      expect(resultState.loginUserError).toBe(null);
      expect(resultState.logoutUserError).toBe(null);
      expect(resultState.registerUserError).toBe(null);
      expect(resultState.updateUserError).toBe(null);
    });
  });
  describe('изменение состояния при запросе updateUser', () => {
    test('изменения при ответе с ошибкой', () => {
      const action = {
        type: updateUser.rejected.type,
        error: { message: 'error' }
      };
      const resultState = userSliceReducer(initialStateWithUser, action);

      expect(resultState.updateUserError).toBe('error');
    });
    test('изменения при успешном ответе', () => {
      const action = { type: updateUser.fulfilled.type, payload: { user: mockUpdatedUserData } };
      const resultState = userSliceReducer(initialStateWithUser, action);

      expect(resultState.updateUserError).toBe(null);
      expect(resultState.user).toEqual(mockUpdatedUserData);
    });
  });
});
