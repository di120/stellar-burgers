import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

export type TUserState = {
  isAuthChecked: boolean;
  user: TUser | null;
  loginUserError: string | null;
  loginUserRequest: boolean;
  registerUserError: string | null;
  logoutUserError: string | null;
  updateUserError: string | null;
};

export const initialState: TUserState = {
  isAuthChecked: false,
  user: null,
  loginUserError: null,
  loginUserRequest: false,
  registerUserError: null,
  logoutUserError: null,
  updateUserError: null
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) =>
    await loginUserApi(data).then((data) => {
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.user;
    })
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) =>
    await registerUserApi(data).then((data) => {
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.user;
    })
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      getUserApi()
        .then((data) => dispatch(setUser(data.user)))
        .catch((err) => {
          if (err.message === 'Failed to fetch') {
            console.log(`Ошибка: ${err.message}`);
          } else {
            deleteCookie('accessToken');
            localStorage.removeItem('refreshToken');
          }
        })
        .finally(() => dispatch(setIsAuthChecked(true)));
    } else {
      dispatch(setIsAuthChecked(true));
    }
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  logoutApi().then(() => {
    localStorage.clear();
    deleteCookie('accessToken');
  });
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => await updateUserApi(data)
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    },
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    }
  },
  selectors: {
    isAuthCheckedSelector: (state) => state.isAuthChecked,
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
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginUserRequest = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
        state.registerUserError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        action.error.message &&
          (state.registerUserError = action.error.message);
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginUserRequest = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        action.error.message && (state.logoutUserError = action.error.message);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loginUserError = null;
        state.logoutUserError = null;
        state.registerUserError = null;
        state.updateUserError = null;
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
  registerError,
  loginError,
  updateErrorSelector
} = userSlice.selectors;

export const { setUser, setIsAuthChecked } = userSlice.actions;

export default userSlice.reducer;
