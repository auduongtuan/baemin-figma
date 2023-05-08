import { isObject } from "lodash-es";
import { LANGUAGES } from "./constant";
import { matchAll } from "./helpers";
import { getTextPropsByCharacters } from "./localeText";
import {
  LocaleItem,
  LocaleItemContent,
  LocaleItemPluralContent,
} from "./types";

export function findItemByKey(key: string, localeItems: LocaleItem[]) {
  return localeItems ? localeItems.find((item) => item.key == key) : null;
}

export function findItemByCharacters(
  characters: string,
  localeItems: LocaleItem[]
) {
  if (localeItems) {
    const text = getTextPropsByCharacters(characters, localeItems);
    if (text && text.item) {
      return text.item;
    }
  }
  return null;
}

export function findItemByKeyOrCharacters(
  key: string,
  characters: string,
  localeItems: LocaleItem[]
) {
  return localeItems
    ? localeItems.find(
        (item) =>
          item.key == key || item.en == characters || item.vi == characters
      )
    : null;
}

export function isPlurals(
  content: LocaleItemContent
): content is LocaleItemPluralContent {
  return typeof content != "string" && isObject(content) && "one" in content;
}
export function getStringContent(content: LocaleItemContent): string {
  if (isPlurals(content)) {
    return content.other || content.one || "";
  } else {
    return content;
  }
}

export function getUsedTags(localeItem: LocaleItem) {
  if (!localeItem) return [];
  const reg = /\<(b|a|ul|li)\b[^>]*>/;

  const tags = Object.keys(LANGUAGES).reduce((acc, lang) => {
    const itemContent = localeItem[lang];
    if (itemContent) {
      if (isPlurals(itemContent)) {
        Object.keys(itemContent).forEach((quantity) => {
          const matches = matchAll(reg, itemContent[quantity]);
          matches.forEach((matchItem) => {
            if (!acc.includes(matchItem[1])) acc.push(matchItem[1]);
          });
        });
      } else {
        const matches = matchAll(reg, itemContent);
        matches.forEach((matchItem) => {
          if (!acc.includes(matchItem[1])) acc.push(matchItem[1]);
        });
      }
    }
    return acc;
  }, []);

  return tags;
}
