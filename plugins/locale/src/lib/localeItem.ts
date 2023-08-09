import { isObject } from "lodash-es";
import { matchAll } from "./helpers";
import { getTextPropsByCharacters } from "./localeText";
import {
  Lang,
  LocaleItem,
  LocaleItemContent,
  LocaleItemId,
  LocaleItemOptionalDuplicated,
  LocaleItemPluralContent,
  LocaleItemWithDuplicated,
  LocaleLibrary,
} from "./types";
import configs from "figma-helpers/configs";
import { LANGUAGE_LIST } from "./constant";

export function findItemByKey(
  key: string,
  localeItems: LocaleItem[]
): LocaleItem | null {
  return localeItems
    ? localeItems.find((item) => "key" in item && item.key == key)
    : null;
}

export function findItemById(
  id: LocaleItemId,
  localeItems: LocaleItem[]
): LocaleItem | null {
  const [libraryId, key] = id;
  return localeItems
    ? localeItems.find(
        (item) =>
          "key" in item && item.key == key && item.fromLibrary == libraryId
      )
    : null;
}

export function isSameItem(item1: LocaleItem, item2: LocaleItem) {
  return item1.key == item2.key && item1.fromLibrary == item2.fromLibrary;
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
  const languages = configs.get("languages");
  return localeItems
    ? localeItems.find(
        (item) =>
          item.key == key ||
          languages.some((lang) => lang in item && item[lang] == characters)
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
  const languages = configs.get("languages");
  const tags = languages.reduce((acc, lang) => {
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
export function filterItemsByLibrary(
  localeItems: LocaleItem[],
  library: LocaleLibrary
) {
  if (!localeItems) return [];

  const filteredLocaleItems = localeItems.filter(
    (item) => "fromLibrary" in item && item.fromLibrary == library.id
  );
  return filteredLocaleItems;
}
export function addDuplicatedPropToItems(
  items: LocaleItem[]
): LocaleItemWithDuplicated[] {
  const keyCounter = items.reduce<{ [key: string]: number }>((acc, item) => {
    if (item.key) {
      acc[item.key] = acc[item.key] ? acc[item.key] + 1 : 1;
    }
    return acc;
  }, {});
  return items.map((item) => ({
    ...item,
    duplicated: keyCounter[item.key] > 1,
  }));
}
export function getLangsInItems(items: LocaleItem[]) {
  const langs = new Set<Lang>();
  // check first 10 items
  items.slice(0, 10).forEach((item) => {
    Object.keys(item).forEach((lang) => {
      if (lang in LANGUAGE_LIST) {
        langs.add(lang as Lang);
      }
    });
  });
  return Array.from(langs);
}
