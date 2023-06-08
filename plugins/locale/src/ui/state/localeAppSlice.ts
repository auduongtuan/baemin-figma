import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Lang, LocaleItem } from "../../lib";
import configs from "figma-helpers/configs";
import { unionWith } from "lodash-es";
interface DialogState {
  opened: boolean;
  key?: "__SELECTED_ITEMS" | string;
  type?: "EDIT" | "NEW" | "DELETE" | "IMPORT";
  onDone?: (localeItem: LocaleItem) => void;
}
const initialState: {
  currentDialog: DialogState;
  isWorking: boolean;
  configs: { languages: Lang[]; defaultLanguage: Lang; altLanguage: Lang };
  list: {
    editMode: boolean;
    source: "all" | string;
    selectedItems: LocaleItem[];
  };
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
  list: {
    source: "all",
    editMode: false,
    selectedItems: [],
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
    setSource: (state, action: PayloadAction<"all" | string>) => {
      state.list = { ...state.list, source: action.payload };
    },
    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.list = { ...state.list, editMode: action.payload };
    },
    addSelectedItems: (state, action: PayloadAction<LocaleItem[]>) => {
      state.list = {
        ...state.list,
        selectedItems: unionWith(
          [...state.list.selectedItems],
          action.payload,
          (a, b) => a.key === b.key
        ),
      };
    },
    removeSelectedItems: (state, action: PayloadAction<LocaleItem[]>) => {
      const filtered = [...state.list.selectedItems].filter(
        (item) => !action.payload.map((item) => item.key).includes(item.key)
      );
      state.list = {
        ...state.list,
        selectedItems: filtered,
      };
    },
    clearSelectedItems: (state) => {
      state.list = { ...state.list, selectedItems: [] };
    },
  },
});

export const {
  setCurrentDialog,
  setIsWorking,
  setConfigs,
  setSource,
  addSelectedItems,
  removeSelectedItems,
  clearSelectedItems,
  setEditMode,
} = localeAppSlice.actions;

export default localeAppSlice.reducer;
