import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocaleItem } from "../../lib";
interface DialogState {
  opened: boolean;
  key?: string;
  type?: "EDIT" | "NEW" | "DELETE" | "IMPORT";
  onDone?: (localeItem: LocaleItem) => void;
}
const initialState: {
  currentDialog: DialogState;
  isWorking: boolean;
  configs: { [key: string]: any };
} = {
  currentDialog: {
    opened: false,
    key: null,
    type: null,
    onDone: undefined,
  },
  isWorking: false,
  configs: {},
};
export const localeAppSlice = createSlice({
  name: "localeApp",
  initialState: initialState,
  reducers: {
    setCurrentDialog: (state, action: PayloadAction<DialogState>) => {
      state.currentDialog = { ...state.currentDialog, ...action.payload };
    },
    setIsWorking: (state, action: PayloadAction<boolean>) => {
      state.isWorking = action.payload;
    },
    setConfigs: (state, action: PayloadAction<{ [key: string]: any }>) => {
      state.configs = { ...state.configs, ...action.payload };
    },
  },
});

export const { setCurrentDialog, setIsWorking, setConfigs } =
  localeAppSlice.actions;

export default localeAppSlice.reducer;
