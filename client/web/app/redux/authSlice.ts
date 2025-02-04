import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { signup, login as apiLogin } from '../services/authService';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  userData: any;
}

interface SignupData {
  fullName: string;
  email: string;
  masterPassword: string;
}

interface LoginData {
  email: string;
  masterPassword: string;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  userData: null,
};

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (userData: SignupData, { rejectWithValue }) => {
    try {
      const response = await signup(userData);
      return response.data;
    } catch (error: any) {
      console.log("error in signup thunk: ", error);
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Signup failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData: LoginData, { rejectWithValue }) => {
    try {
      const response = await apiLogin(loginData.email, loginData.masterPassword);
      console.log("response in login thunk: ", response);
      return response.data;
    } catch (error: any) {
      console.log("error in login thunk: ", error);
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<{ token: string; userData: any }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.userData = action.payload.userData;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.userData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.userData = action.payload.userData;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLogin, logout } = authSlice.actions;
export default authSlice.reducer;