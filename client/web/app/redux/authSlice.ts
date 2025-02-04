import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { signup, login as apiLogin, fetchUserProfile } from '../services/authService';
import { getToken, setToken, removeToken } from '../utils/authUtils';

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
  token: typeof window !== 'undefined' ? getToken() : null,
  isAuthenticated: typeof window !== 'undefined' ? !!getToken() : false,
  loading: false,
  error: null,
  userData: null,
};

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (userData: SignupData, { rejectWithValue }) => {
    try {
      const response = await signup(userData);
      return response;
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
      return response;
    } catch (error: any) {
      console.log("error in login thunk: ", error);
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Login failed');
    }
  }
);

// Add fetchProfile thunk
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUserProfile();
      console.log("Profile fetch response:", response);
      return response;
    } catch (error: any) {
      console.error("Profile fetch error:", error);
      return rejectWithValue(error.message || 'Failed to fetch profile');
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
      setToken(action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.userData = null;
      removeToken();
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
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.userData = action.payload.userData;
        setToken(action.payload.token);
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
        setToken(action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProfile.pending, (state) => {
        console.log("Profile fetch pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        console.log("Profile fetch fulfilled:", action.payload);
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        console.log("Profile fetch rejected:", action.payload);
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLogin, logout } = authSlice.actions;
export default authSlice.reducer;