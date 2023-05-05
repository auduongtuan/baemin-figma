import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocaleItem } from "../../lib/localeData";
interface DialogState {
  opened: boolean;
  key?: string;
  type?: 'EDIT' | 'NEW' | 'DELETE' | 'IMPORT';
  onDone?: (localeItem: LocaleItem) => void
}
const initialState: {
  currentDialog: DialogState,
  isWorking: boolean
} = {
  currentDialog: {
    opened: false,
    key: null,
    type: null,
    onDone: undefined
  },
  isWorking: false
};
export const localeAppSlice = createSlice({
  name: "localeApp",
  initialState: initialState,
  reducers: {
    setCurrentDialog: (state, action: PayloadAction<DialogState>) => {
      state.currentDialog = {...state.currentDialog, ...action.payload};
    },
    setIsWorking: (state, action: PayloadAction<boolean>) => {
      state.isWorking = action.payload;
    },
  }
});

export const {
  setCurrentDialog,
  setIsWorking
} = localeAppSlice.actions;

export default localeAppSlice.reducer;