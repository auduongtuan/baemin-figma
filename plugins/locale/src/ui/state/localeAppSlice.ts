import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Lang, LocaleItem, Configs, LocaleItemId, isSameItem } from "../../lib";
import configs from "figma-helpers/configs";
import { unionWith } from "lodash-es";
export interface DialogState {
  // [libraryId, key]
  key?: "__SELECTED_ITEMS" | LocaleItemId;
  type?:
    | "VIEW"
    | "EDIT"
    | "NEW"
    | "DELETE"
    | "IMPORT"
    | "MOVE_LIBRARY"
    | "MOVE_GROUP";
  onDone?: (localeItem: LocaleItem) => void;
}

const initialState: {
  currentDialog: DialogState;
  isReady: boolean;
  isDevMode: boolean;
  isWorking: boolean;
  configs: Configs;
  list: {
    editMode: boolean;
    source: "all" | string;
    selectedItems: LocaleItem[];
  };
} = {
  currentDialog: {
    key: null,
    type: null,
    onDone: null,
  },
  isWorking: false,
  isReady: false,
  isDevMode: null,
  configs: {
    languages: [],
    defaultLanguage: null,
    altLanguage: null,
    numberFormat: "by-language",
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
    closeCurrentDialog: (state) => {
      state.currentDialog = {
        key: null,
        type: null,
        onDone: null,
      };
    },
    setCurrentDialog: (state, action: PayloadAction<DialogState>) => {
      state.currentDialog = { ...state.currentDialog, ...action.payload };
    },
    setIsWorking: (state, action: PayloadAction<boolean>) => {
      state.isWorking = action.payload;
    },
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
    setIsDevMode: (state, action: PayloadAction<boolean>) => {
      state.isDevMode = action.payload;
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
          (a, b) => isSameItem(a, b)
        ),
      };
    },
    removeSelectedItems: (state, action: PayloadAction<LocaleItem[]>) => {
      const filtered = [...state.list.selectedItems].filter(
        (item) =>
          !action.payload
            .map((item) => item.key + item.fromLibrary)
            .includes(item.key + item.fromLibrary)
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
  closeCurrentDialog,
  setCurrentDialog,
  setIsWorking,
  setIsReady,
  setIsDevMode,
  setConfigs,
  setSource,
  addSelectedItems,
  removeSelectedItems,
  clearSelectedItems,
  setEditMode,
} = localeAppSlice.actions;

export default localeAppSlice.reducer;
