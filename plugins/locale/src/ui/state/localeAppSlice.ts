import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Lang, LocaleItem } from "../../lib";
import configs from "figma-helpers/configs";
interface DialogState {
  opened: boolean;
  key?: string;
  type?: "EDIT" | "NEW" | "DELETE" | "IMPORT";
  onDone?: (localeItem: LocaleItem) => void;
}
const initialState: {
  currentDialog: DialogState;
  isWorking: boolean;
  configs: { languages: Lang[]; defaultLanguage: Lang; altLanguage: Lang };
} = {
  currentDialog: {
    opened: false,
    key: null,
    type: null,
    onDone: undefined,
  },
  isWorking: false,
  configs: {
    languages: [],
    defaultLanguage: null,
    altLanguage: null,
  },
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
      const newConfigs = { ...state.configs, ...action.payload };
      if (newConfigs.languages && newConfigs.defaultLanguage) {
        newConfigs.altLanguage = newConfigs.languages.find(
          (lang) => lang !== newConfigs.defaultLanguage
        );
      }
      configs.setAll(newConfigs);
      state.configs = newConfigs;
    },
  },
});

export const { setCurrentDialog, setIsWorking, setConfigs } =
  localeAppSlice.actions;

export default localeAppSlice.reducer;
