import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StorageService } from '../services';

interface UiState {
  language: 'ar' | 'en';
  theme: 'light' | 'dark';
  mobileSidebarOpen: boolean;
}

const initialState: UiState = {
  language: StorageService.getLanguage(),
  theme: StorageService.getTheme(),
  mobileSidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<'ar' | 'en'>) {
      state.language = action.payload;
      StorageService.setLanguage(action.payload);
      // Update HTML attributes
      document.documentElement.lang = action.payload;
      document.documentElement.dir = action.payload === 'ar' ? 'rtl' : 'ltr';
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
      StorageService.setTheme(action.payload);
      // Update HTML class list
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    toggleTheme(state) {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      StorageService.setTheme(newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setMobileSidebar(state, action: PayloadAction<boolean>) {
      state.mobileSidebarOpen = action.payload;
    },
  },
});

export const { setLanguage, setTheme, toggleTheme, setMobileSidebar } = uiSlice.actions;
export default uiSlice.reducer;
