import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { signup as signupService } from '../services/authService';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: any;
  userData: any;
}

interface SignupData {
  fullName: string;
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
  '/signup',
  async (userData: SignupData, { rejectWithValue }) => {
    try {
      const response = await signupService(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
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
        state.error = action.payload;
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
