import { MIXED_VALUE } from "../constant/locale";
import { findMatches } from "./helpers";
export interface LocaleData {
  sheetName?: string;
  sheetId?: string;
  localeSelection?: LocaleSelection;
  localeItems?: LocaleItem[];
  matchedItem?: LocaleItem;
  modifiedTime?: string;
}
export interface LocaleItem {
  key: string;
  en?: string;
  vi?: string;
  plurals?: {
    zero?: Omit<LocaleItem, "key">,
    one?: Omit<LocaleItem, "key">,
    two?: Omit<LocaleItem, "key">,
    few?: Omit<LocaleItem, "key">,
    many?: Omit<LocaleItem, "key">,
    other?: Omit<LocaleItem, "key">,
  }
}
export type Lang = 'en' | 'vi';

export type LocaleTextVariables = {[key:string]: number|string}
export interface LocaleText {
  id?: string;
  key?: string;
  lang?: Lang | typeof MIXED_VALUE;
  characters?: string;
  variables?: LocaleTextVariables;
}

export const commands = ['select_texts', 'switch_lang', 'update_text', 'get_locale_data', 'save_locale_data', 'export_code', 'show_figma_notify', 'auto_set_key'] as const;
export type Command = typeof commands[number];
export interface LocaleSelection extends LocaleText {
  summary?: {
    lang: Lang | typeof MIXED_VALUE,
    key: string | typeof MIXED_VALUE
  },
  multiple?: boolean;
  texts?: LocaleText[]
}
export function findItemByKey(key: string, localeItems: LocaleItem[]) {
  return localeItems ? localeItems.find(item => item.key == key) : null;
}
export function findItemByCharacters(characters: string, localeItems: LocaleItem[]) {
  return localeItems ? localeItems.find(item => item.en == characters || item.vi == characters) : null;
}
export function findItemByKeyOrCharacters(key: string, characters: string, localeItems: LocaleItem[]) {
  return localeItems ? localeItems.find(item => item.key == key || item.en == characters || item.vi == characters) : null;
}
export function getVariableNames(localeItem: LocaleItem, text: LocaleText) {
  if(!localeItem) return [];
  const variableNames = [];
  const reg = /\{\{([^}]+)\}\}/g;
  if(localeItem.plurals) {
    Object.keys(localeItem.plurals).forEach(quantity => {
      const matches = findMatches(reg, localeItem.plurals[quantity][text.lang as Lang]);
      matches.forEach(matchItem => {
        if(!variableNames.includes(matchItem[1])) variableNames.push(matchItem[1]);
      });
    });
  } else {
    if(localeItem[text.lang as Lang]) {
      const matches = findMatches(reg, localeItem[text.lang as Lang]);
      matches.forEach(matchItem => {
        if(!variableNames.includes(matchItem[1])) variableNames.push(matchItem[1]);
      });
    } 
  }
  return variableNames;
}