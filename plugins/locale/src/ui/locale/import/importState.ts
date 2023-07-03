import { getDefaultLocalLibraryId } from "@ui/state/helpers";
import { LocaleItem } from "@lib";
export interface ImportFile {
  name: string;
  items: Object;
}
export const getInitialImportState = () => ({
  files: [],
  items: [],
  options: { override: false, libraryId: getDefaultLocalLibraryId() },
});
export const importReducer = (
  state: {
    files: ImportFile[];
    items: LocaleItem[];
    options: { override: boolean; libraryId: string };
  },
  action: {
    type: "ADD_FILE" | "SET_ITEMS" | "CHANGE_OPTIONS" | "RESET";
    file?: ImportFile;
    items?: LocaleItem[];
    options?: { override?: boolean; libraryId?: string };
  }
) => {
  if (action.type == "ADD_FILE") {
    state = { ...state, files: [...state.files, action.file] };
  } else if (action.type == "SET_ITEMS") {
    state = { ...state, items: [...action.items] };
  } else if (action.type == "CHANGE_OPTIONS") {
    state = { ...state, options: { ...state.options, ...action.options } };
  } else if (action.type == "RESET") {
    state = { ...getInitialImportState() };
  }
  return state;
};
