import { escapeRegExp, isObject } from "lodash";
import { DEFAULT_LANG, LANGUAGES } from "./constant";
import { compareTime, matchAll, placeholders } from "./helpers";
import { isPlurals } from "./localeItem";
import {
  Lang,
  LocaleItem,
  LocaleItemContent,
  LocaleText,
  LocaleTextProps,
  LocaleTextVariables,
} from "./types";
export function applyVariablesToContent(
  localeItemContent: LocaleItemContent,
  variables: LocaleTextVariables
): string {
  if (!isPlurals(localeItemContent)) {
    if (variables && localeItemContent) {
      return placeholders(localeItemContent, variables);
    } else {
      return localeItemContent;
    }
  }
  // PLURAL FORM
  else {
    if (!("count" in variables)) {
      variables.count = 1;
    }
    const count =
      typeof variables.count == "string"
        ? parseInt(variables.count)
        : variables.count;
    if (
      count == 1 &&
      isObject(localeItemContent) &&
      "one" in localeItemContent
    ) {
      return placeholders(localeItemContent.one || "", variables);
    }
    if (
      count != 1 &&
      isObject(localeItemContent) &&
      "other" in localeItemContent
    ) {
      return placeholders(localeItemContent.other || "", variables);
    }
  }
}

export function getTextPropsByCharacters(
  characters: string,
  localeItems: LocaleItem[]
): LocaleTextProps {
  if (localeItems) {
    let foundLang: string;
    let foundVariables: LocaleTextVariables;
    const item = [...localeItems]
      .sort(
        (a, b) =>
          Number(b.prioritized) - Number(a.prioritized) ||
          compareTime(b.updatedAt, a.updatedAt) ||
          compareTime(b.createdAt, a.createdAt)
      )
      .find((item) => {
        return Object.keys(LANGUAGES).some((lang: Lang) => {
          const itemContent = item[lang];
          if (!isPlurals(itemContent)) {
            if (isCharactersMatch(characters, itemContent)) {
              foundLang = lang;
              foundVariables = findVariablesInCharacters(
                characters,
                itemContent
              );
              return true;
            }
          } else {
            return Object.keys(itemContent).some((quantity) => {
              // console.log({
              //   characters,
              //   itemContent,
              //   quantity,
              //   matched: isCharactersMatch(characters, itemContent[quantity]),
              // });
              if (isCharactersMatch(characters, itemContent[quantity])) {
                foundLang = lang;
                foundVariables = findVariablesInCharacters(
                  characters,
                  itemContent[quantity]
                );
                return true;
              }
            });
          }
        });
      });
    if (item) {
      return {
        item,
        key: item.key,
        lang: foundLang as Lang,
        variables: foundVariables,
      };
    }
    // console.log(item.vi.replace(/\{\{([^}]+)\}\}/g, '(.*)'));
    // return false;
  }
  return { item: null, lang: null, key: null, variables: {} };
}
function isCharactersMatch(
  characters: string,
  itemContentString: string,
  caseSensitive = false
) {
  if (itemContentString == characters) {
    return true;
  } else {
    if (!itemContentString) return false;
    const escaped = escapeRegExp(
      itemContentString.replace(/\{\{([^}]+)\}\}/g, "(.*)")
    );
    const readded = escaped.replace("\\(\\.\\*\\)", "(.*)");
    // except for only variable case. e.g: {{url}}
    if (readded == "(.*)") return false;
    const regexp = caseSensitive
      ? new RegExp(`^${readded}$`)
      : new RegExp(`^${readded}$`, "i");
    if (characters && characters.match(regexp)) {
      return true;
    }
  }
  return false;
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

  // console.log({
  //   variableNames,
  //   variableValues,
  //   valueReg,
  //   matchTest: matchAll(valueReg, characters),
  // });
  return variableNames.reduce((acc, name, i) => {
    acc[name] = variableValues[i];
    return acc;
  }, {});
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
