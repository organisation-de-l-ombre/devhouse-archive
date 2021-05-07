import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Themes = "light" | "dark";

export interface ThemeState {
  theme: Themes;
}

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: "light",
  } as ThemeState,
  reducers: {
    setTheme(state, { payload }: PayloadAction<Themes>) {
      state.theme = payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
