import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';
import { StorageService } from '../services';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: StorageService.getCurrentUser(),
  isAuthenticated: !!StorageService.getCurrentUser(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    logoutSuccess(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    updateProfileSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
});

export const { setAuthLoading, setAuthError, loginSuccess, logoutSuccess, updateProfileSuccess } = authSlice.actions;
export default authSlice.reducer;
