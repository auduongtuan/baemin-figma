import { MIXED_VALUE, LANGUAGES } from "./constant";

export interface LocaleData {
  sheetName?: string;
  sheetId?: string;
  // localeSelection?: LocaleSelection;
  localeItems?: LocaleItem[];
  localeLibraries?: LocaleLibrary[];
  // matchedItem?: LocaleItem;
  modifiedTime?: string;
}
export type LocaleLibrary = {
  id?: string; // node id
  name?: string;
  local: boolean;
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
export type Lang = keyof typeof LANGUAGES;

export type LocaleItem = {
  key: string;
  fromLibrary?: boolean | string;
  createdAt?: string;
  updatedAt?: string;
  prioritized?: boolean;
  imported?: boolean;
} & {
  [key in Lang]?: LocaleItemContent;
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
  lang?: Lang | typeof MIXED_VALUE;
  characters?: string;
  variables?: LocaleTextVariables;
}
export interface LocaleTextProps
  extends Omit<LocaleText, "id" | "lang" | "characters"> {
  // ids?: string | string[];
  item?: LocaleItem;
  items?: LocaleItem[];
  lang?: Lang;
}
export interface LocaleSelection {
  summary?: {
    lang: Lang | typeof MIXED_VALUE;
    key: string | typeof MIXED_VALUE;
  };
  multiple?: boolean;
  texts?: LocaleText[];
}
