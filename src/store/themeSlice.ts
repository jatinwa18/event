import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Theme = string | null;

interface ThemeState {
  selectedTheme: Theme;
}

const initialState: ThemeState = {
  selectedTheme: null,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.selectedTheme = action.payload;
    },
    clearTheme: (state) => {
      state.selectedTheme = null;
    },
  },
});

// ✔ THESE MUST BE EXPORTED EXACTLY LIKE THIS
export const { setTheme, clearTheme } = themeSlice.actions;
export default themeSlice.reducer;
