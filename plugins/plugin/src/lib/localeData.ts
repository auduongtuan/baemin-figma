import { escapeRegExp } from "lodash";
import { DEFAULT_LANG, MIXED_VALUE, LANGUAGES } from "../constant/locale";
import { matchAll } from "./helpers";
import { placeholders } from "./helpers";
export interface LocaleData {
  sheetName?: string;
  sheetId?: string;
  // localeSelection?: LocaleSelection;
  localeItems?: LocaleItem[];
  // matchedItem?: LocaleItem;
  modifiedTime?: string;
}

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

export type LocaleItem = { key: string, fromLibrary?: boolean, } & {
  [key in Lang]: LocaleItemContent;
};

export type LocaleTextVariables = { [key: string]: number | string };
export interface LocaleText {
  id?: string;
  key?: string;
  lang?: Lang | typeof MIXED_VALUE;
  characters?: string;
  variables?: LocaleTextVariables;
  item?: LocaleItem;
}
export interface LocaleSelection {
  summary?: {
    lang: Lang | typeof MIXED_VALUE;
    key: string | typeof MIXED_VALUE;
  };
  multiple?: boolean;
  texts?: LocaleText[];
}
export function isPlurals(
  content: LocaleItemContent
): content is LocaleItemPluralContent {
  return typeof content != "string" && "one" in content;
}
export function findItemByKey(key: string, localeItems: LocaleItem[]) {
  return localeItems ? localeItems.find((item) => item.key == key) : null;
}
function isCharactersMatch(characters: string, itemContentString: string) {
  if (itemContentString == characters) {
    return true;
  } else {
    const escaped = escapeRegExp(itemContentString.replace(/\{\{([^}]+)\}\}/g, "(.*)"));
    const readded = escaped.replace('\\(\\.\\*\\)', '(.*)');
    const regexp = new RegExp(
      `^${readded}$`
    );
    if (characters && characters.match(regexp)) {
      return true;
    }
  }
  return false;
}

export function getTextByCharacter(
  characters: string,
  localeItems: LocaleItem[]
): LocaleText {
  if (localeItems) {
    let foundLang: string;
    let foundVariables: LocaleTextVariables;
    const item = localeItems.find((item) => {
      return Object.keys(LANGUAGES).some((lang: Lang) => {
        const itemContent = item[lang];
        if (!isPlurals(itemContent)) {
          if(isCharactersMatch(characters, itemContent)) {
            foundLang = lang;
            foundVariables = findVariablesInCharacters(characters, itemContent);
            return true;
          }
        } else {
          return Object.keys(itemContent).some(quantity => {
            console.log({characters, itemContent, quantity, matched: isCharactersMatch(characters, itemContent[quantity])});
            if(isCharactersMatch(characters, itemContent[quantity])) {
              foundLang = lang;
              foundVariables = findVariablesInCharacters(characters, itemContent[quantity]);
              return true;
            }
          })
        }
      });
    });
    if (item) {
      return {
        item,
        key: item.key,
        lang: foundLang as Lang,
        variables: foundVariables
      };
    }
    // console.log(item.vi.replace(/\{\{([^}]+)\}\}/g, '(.*)'));
    // return false;
  }
  return {item: null, lang: null, key: null, variables: {}}
}
export function findItemByCharacters(
  characters: string,
  localeItems: LocaleItem[]
) {
  return localeItems
    ? getTextByCharacter(characters, localeItems).item
    : null;
}
export function findVariablesInCharacters(
  characters: string,
  template: string
) {
  const nameReg = /\{\{([^}]+)\}\}/g;
  // const characters = "Welcome Tuấn nha";
  // const template = "Welcome {{merchant}} nha";

  // variable names in template, allow duplicating
  const variableNames = matchAll(nameReg, template).map((match) => match[1]);

  const valueReg = new RegExp(
    `^${template.replace(/\{\{([^}]+)\}\}/g, "(.*)")}$`
  );
  const variableValues = matchAll(valueReg, characters).map(
    (match) => match[1]
  );

  console.log({
    variableNames,
    variableValues,
    valueReg,
    matchTest: matchAll(valueReg, characters),
  });
  return variableNames.reduce((acc, name, i) => {
    acc[name] = variableValues[i];
    return acc;
  }, {});
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
export function getVariableNames(localeItem: LocaleItem, text: LocaleText) {
  if (!localeItem) return [];
  const variableNames = [];
  const reg = /\{\{([^}]+)\}\}/g;
  const currentLang = (text.lang as Lang) || DEFAULT_LANG;
  const itemContent = localeItem[currentLang];
  if (itemContent) {
    if (isPlurals(itemContent)) {
      Object.keys(itemContent).forEach((quantity) => {
        const matches = matchAll(reg, itemContent[quantity]);
        matches.forEach((matchItem) => {
          if (!variableNames.includes(matchItem[1]))
            variableNames.push(matchItem[1]);
        });
      });
    } else {
      const matches = matchAll(reg, itemContent);
      matches.forEach((matchItem) => {
        if (!variableNames.includes(matchItem[1]))
          variableNames.push(matchItem[1]);
      });
    }
  }
  return variableNames;
}

export function getTextCharacters(localeItemContent: LocaleItemContent, variables: LocaleTextVariables): string {
  if (!isPlurals(localeItemContent)) {
    if (variables && localeItemContent) {
      console.log('localeItemContent', localeItemContent);
      return placeholders(
        localeItemContent,
        variables
      );
    } else {
      return localeItemContent;
    }
  } 
  // PLURAL FORM
  else {
    if(!('count' in variables)) {
      variables.count = 1;
    }
    const count = typeof variables.count == 'string' ? parseInt(variables.count) : variables.count;
    if(count == 1 && 'one' in localeItemContent) {
      return placeholders(
        localeItemContent.one,
        variables
      );
    }
    if(count != 1 && 'other' in localeItemContent) {
      return placeholders(
        localeItemContent.other,
        variables
      );
    }
  }
}