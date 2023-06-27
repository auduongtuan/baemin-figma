import { MIXED_VALUE, LANGUAGE_LIST } from "./constant";

export interface SavedLocaleData {
  sheetName?: string;
  sheetId?: string;
  // localeSelection?: LocaleSelection;
  localeItems?: SavedLocaleItem[];
  localeLibraries?: LocaleLibrary[];
  // matchedItem?: LocaleItem;
  modifiedTime?: string;
}
export interface LocaleData extends SavedLocaleData {
  localeSelection?: LocaleSelection;
  localeLibraries?: LocaleLibrary[];
  localeItems?: LocaleItemWithDuplicated[];
}

export type LocaleLibrary = {
  id: string; // node id
  name: string;
  local: boolean;
  main: boolean;
};
export type LocaleItemPluralContent = {
  zero?: "string";
  one?: "string";
  two?: "string";
  few?: "string";
  many?: "string";
  other?: "string";
};
export type LocaleItemContent = string | LocaleItemPluralContent;
export type Lang = keyof typeof LANGUAGE_LIST;

export type SavedLocaleItem = {
  key: string;
  createdAt?: string;
  updatedAt?: string;
  prioritized?: boolean;
  imported?: boolean;
} & {
  [key in Lang]?: LocaleItemContent;
};
// [libraryId, key]
export type LocaleItemId = [LocaleItem["fromLibrary"], LocaleItem["key"]];
export type LocaleItem = SavedLocaleItem & {
  fromLibrary: string;
  isLocal: boolean;
  // [libraryId, key]
  duplicated?: boolean;
};
export type LocaleItemOptionalDuplicated = Omit<LocaleItem, "duplicated"> & {
  duplicated?: boolean;
};
export type LocaleItemWithDuplicated = Omit<LocaleItem, "duplicated"> & {
  duplicated: boolean;
};
export type LocaleTextVariables = { [key: string]: number | string };
export type LocaleTextStyles = {
  bold?: {
    color?: string;
    style?: string;
  };
  link?: {
    color?: string;
    style?: string;
  };
};
export interface LocaleText {
  id?: string;
  key?: string;
  formula?: string;
  lang?: Lang;
  characters?: string;
  variables?: LocaleTextVariables;
}
export interface LocaleTextProps extends Omit<LocaleText, "id" | "characters"> {
  // ids?: string | string[];
  item?: LocaleItem;
  // items?: LocaleItem[];
}
export interface LocaleSelection {
  summary?: {
    lang: Lang | typeof MIXED_VALUE;
    key: string | typeof MIXED_VALUE;
  };
  multiple?: boolean;
  texts?: LocaleText[];
}
export type LocaleJsonFormat = "i18n-js" | "i18next";

export interface Configs {
  languages: Lang[];
  defaultLanguage: Lang;
  altLanguage: Lang;
}
