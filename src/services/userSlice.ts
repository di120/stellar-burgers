import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../utils/cookie';

type TUserState = {
  isAuthChecked: boolean; // флаг для статуса проверки токена пользователя
  isAuthenticated: boolean;
  user: TUser | null;
  loginUserError: string | null;
  loginUserRequest: boolean;
  registerUserError: string | null;
  updateUserError: string | null;
};

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  user: null,
  loginUserError: null,
  loginUserRequest: false,
  registerUserError: null,
  updateUserError: null
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => await loginUserApi(data)
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => await registerUserApi(data)
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  async () => await getUserApi()
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async () => await logoutApi()
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => await updateUserApi(data)
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    isAuthCheckedSelector: (state) => state.isAuthChecked,
    isAuthenticatedSelector: (state) => state.isAuthenticated,
    userSelector: (state) => state.user,
    registerError: (state) => state.registerUserError,
    loginError: (state) => state.loginUserError,
    updateErrorSelector: (state) => state.updateUserError
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        action.error.message && (state.loginUserError = action.error.message);
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
        state.user = action.payload.user;
        state.loginUserRequest = false;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        action.error.message &&
          (state.registerUserError = action.error.message);
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
        state.user = action.payload.user;
        state.loginUserRequest = false;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(logoutUser.rejected, () => {
        console.log('Ошибка выполнения выхода');
      })
      .addCase(logoutUser.fulfilled, (state) => {
        localStorage.clear();
        deleteCookie('accessToken');
        return initialState;
      })
      .addCase(updateUser.rejected, (state, action) => {
        action.error.message && (state.updateUserError = action.error.message);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.updateUserError = null;
      });
  }
});

export const {
  isAuthCheckedSelector,
  userSelector,
  isAuthenticatedSelector,
  registerError,
  loginError,
  updateErrorSelector
} = userSlice.selectors;
