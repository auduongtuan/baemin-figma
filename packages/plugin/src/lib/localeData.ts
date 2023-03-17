import { MIXED_VALUE } from "../constant/locale";
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
  en: string;
  vi: string;
}
export interface LocaleText {
  id?: string;
  key?: string;
  lang?: 'en' | 'vi' | typeof MIXED_VALUE;
  characters?: string;
  variables?: string;
}
export const commands = ['select_texts', 'switch_lang', 'update_text', 'get_locale_data', 'save_locale_data', 'export_code', 'show_figma_notify', 'auto_set_key'] as const;
export type Command = typeof commands[number];
export interface LocaleSelection extends LocaleText {
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