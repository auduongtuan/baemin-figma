import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocaleItem } from "../../lib/localeData";
const initialState: {
  newDialogOpened: boolean,
  editDialogOpened: string,
  newDialogOnDone: (localeItem: LocaleItem) => void,
  isWorking: boolean
} = {
  newDialogOpened: false,
  editDialogOpened: '',
  newDialogOnDone: undefined,
  isWorking: false
};
export const localeAppSlice = createSlice({
  name: "localeApp",
  initialState: initialState,
  reducers: {
    setNewDialogOpened: (state, action: PayloadAction<boolean>) => {
      state.newDialogOpened = action.payload;
    },
    setEditDialogOpened: (state, action: PayloadAction<string>) => {
      state.editDialogOpened = action.payload;
    },
    setNewDialogOnDone: (state, action: PayloadAction<(localeItem: LocaleItem) => void>) => {
      state.newDialogOnDone = action.payload;
    },
    setIsWorking: (state, action: PayloadAction<boolean>) => {
      state.isWorking = action.payload;
    },
  }
});

export const {
  setNewDialogOpened,
  setEditDialogOpened,
  setNewDialogOnDone,
  setIsWorking
} = localeAppSlice.actions;

export default localeAppSlice.reducer;