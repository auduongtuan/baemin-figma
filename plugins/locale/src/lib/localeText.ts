import { escapeRegExp, isObject } from "lodash-es";
import { DEFAULT_LANG, LANGUAGES } from "./constant";
import { compareTime, matchAll, placeholders, stripTags } from "./helpers";
import parseTagsInText from "./parseTagsInText";
import { isPlurals } from "./localeItem";
import {
  Lang,
  LocaleItem,
  LocaleItemContent,
  LocaleText,
  LocaleTextProps,
  LocaleTextVariables,
} from "./types";
import { findItemByKey } from "./localeItem";
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
  // stripped html tags
  const template = itemContentString ? stripTags(itemContentString) : "";
  if (template == characters) {
    return true;
  } else {
    if (!template) return false;
    const escaped = escapeRegExp(template.replace(/\{\{([^}]+)\}\}/g, "(.*)"));
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
  itemContentString: string
) {
  const nameReg = /\{\{([^}]+)\}\}/g;
  const template = stripTags(itemContentString);
  // variable names in template, allow duplicating
  const variableNames = matchAll(nameReg, template).map((match) => match[1]);

  const valueReg = new RegExp(
    `^${template.replace(/\{\{([^}]+)\}\}/g, "(.*)")}$`
  );
  const variableValues = matchAll(valueReg, characters).map(
    (match) => match[1]
  );

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

export function parseFormula(textProps: LocaleTextProps) {
  const { formula, items, lang = DEFAULT_LANG, variables = {} } = textProps;
  let newString = formula;
  const matches = matchAll(/\:\s*([A-Za-z0-9\._]+)\s*\:/, formula);
  if (matches) {
    matches.forEach((match: string[]) => {
      if (match.length > 1) {
        const localeItem = findItemByKey(match[1], items);
        if (localeItem) {
          const newLocaleItemContent =
            lang in localeItem ? localeItem[lang] : undefined;
          if (newLocaleItemContent) {
            newString = newString.replace(
              match[0],
              applyVariablesToContent(newLocaleItemContent, variables)
            );
          }
        }
      }
    });
  }
  return newString;
}

export function getTextCharactersWithTags(
  textProps: LocaleTextProps,
  lang: Lang,
  variables: LocaleTextVariables = {}
) {
  return textProps.formula
    ? parseFormula({ ...textProps, lang: lang })
    : applyVariablesToContent(textProps.item[lang], variables);
}

export function getParsedText(
  textProps: LocaleTextProps,
  newLang: Lang,
  variables: LocaleTextVariables = {}
) {
  const textCharactersWithTags = getTextCharactersWithTags(
    textProps,
    newLang,
    variables
  );
  const parsedText = parseTagsInText(textCharactersWithTags);
  return parsedText;
}
