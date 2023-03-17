import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const localeAppSlice = createSlice({
  name: "localeApp",
  initialState: {
    newDialogOpened: false
  },
  reducers: {
    setNewDialogOpened: (state, action: PayloadAction<boolean>) => {
      state.newDialogOpened = action.payload;
    }
  }
});

export const {
  setNewDialogOpened
} = localeAppSlice.actions;

export default localeAppSlice.reducer;