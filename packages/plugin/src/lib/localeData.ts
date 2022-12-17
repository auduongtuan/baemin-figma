export interface LocaleItem {
  key: string;
  en: string;
  vi: string;
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