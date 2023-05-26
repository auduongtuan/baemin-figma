import configs from "figma-helpers/configs";
import { escapeRegExp, isObject } from "lodash-es";
import {
  compareTimeDesc,
  isNumeric,
  matchAll,
  placeholders,
  stripTags,
} from "./helpers";
import parseTagsInText from "./parseTagsInText";
import { isPlurals } from "./localeItem";
import {
  Lang,
  LocaleItem,
  LocaleItemContent,
  LocaleTextProps,
  LocaleTextVariables,
  LocaleText,
} from "./types";
import { findItemByKey } from "./localeItem";
export function applyVariablesToContent(
  localeItemContent: LocaleItemContent,
  originVariables: LocaleTextVariables
): string {
  const variables = { ...originVariables };
  function addDefaultCount() {
    if (!("count" in variables) || !variables.count) {
      variables.count = 1;
    }
    if (typeof variables.count == "string") {
      variables.count = parseInt(variables.count);
    }
  }
  // PLURAL FORM
  if (isPlurals(localeItemContent)) {
    addDefaultCount();
    if (variables.count == 1 && "one" in localeItemContent) {
      return placeholders(localeItemContent.one || "", variables);
    }
    if (variables.count != 1 && "other" in localeItemContent) {
      return placeholders(localeItemContent.other || "", variables);
    }
  } else {
    // Non plurals
    if (variables && localeItemContent) {
      const variableNames = getVariableNamesFromItemContent(localeItemContent);
      if (variableNames.includes("count")) addDefaultCount();
      return placeholders(localeItemContent, variables);
    } else {
      return localeItemContent;
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
          compareTimeDesc(a.updatedAt, b.updatedAt) ||
          compareTimeDesc(a.createdAt, b.createdAt)
      )
      .find((item) => {
        return configs.get("languages").some((lang: Lang) => {
          const itemContent = item[lang];
          if (!isPlurals(itemContent)) {
            if (isCharactersMatch(characters, itemContent)) {
              foundLang = lang;
              foundVariables = findVariablesInCharacters(
                characters,
                itemContent
              );
              if (
                "count" in foundVariables &&
                !isNumeric(foundVariables.count)
              ) {
                return false;
              }
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
                if (
                  "count" in foundVariables &&
                  !isNumeric(foundVariables.count)
                ) {
                  return false;
                }
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

export function getVariableNamesFromItemContent(
  itemContent: LocaleItemContent
): string[] {
  const variableNames = [];
  const reg = /\{\{([^}]+)\}\}/g;
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
export function getVariableNames(
  textProps: LocaleTextProps,
  items: LocaleItem[]
) {
  const { formula, item, lang = configs.get("defaultLanguage") } = textProps;
  const variableNames = new Set<string>();
  if (formula) {
    matchFormula(formula, items, (localeItem) => {
      const newLocaleItemContent =
        lang in localeItem ? localeItem[lang] : undefined;
      if (newLocaleItemContent)
        getVariableNamesFromItemContent(newLocaleItemContent).forEach((name) =>
          variableNames.add(name)
        );
    });
  }
  if (item) {
    const itemContent = lang in item ? item[lang] : undefined;
    if (itemContent)
      getVariableNamesFromItemContent(itemContent).forEach((name) =>
        variableNames.add(name)
      );
  }
  return [...variableNames];
}

export function matchFormula(
  formula: string,
  items: LocaleItem[],
  callback?: (item?: LocaleItem, match?: string[]) => void
) {
  const matches = matchAll(/\:\s*([A-Za-z0-9\._]+)\s*\:/, formula);
  if (matches) {
    matches.forEach((match: string[]) => {
      if (match.length > 1) {
        const localeItem = findItemByKey(match[1], items);
        if (localeItem) {
          callback(localeItem, match);
        }
      }
    });
  }
  return matches;
}

export function parseFormula(props: LocaleTextProps, items: LocaleItem[]) {
  const {
    formula,
    lang = configs.get("defaultLanguage"),
    variables = {},
  } = props;
  let newString = formula;
  matchFormula(formula, items, (item, match) => {
    const newLocaleItemContent = lang in item ? item[lang] : undefined;
    if (newLocaleItemContent) {
      newString = newString.replace(
        match[0],
        applyVariablesToContent(newLocaleItemContent, variables)
      );
    }
  });
  return newString;
}

export function getTextCharactersWithTags(
  textProps: LocaleTextProps,
  items: LocaleItem[]
) {
  if ("formula" in textProps && textProps.formula) {
    return parseFormula(textProps, items);
  } else {
    if (textProps.item && textProps.lang in textProps.item) {
      return applyVariablesToContent(
        textProps.item[textProps.lang],
        textProps.variables
      );
    } else {
      return undefined;
    }
  }
}

export function getParseText(textProps: LocaleTextProps, items: LocaleItem[]) {
  const textCharactersWithTags = getTextCharactersWithTags(textProps, items);
  if (!textCharactersWithTags) return undefined;
  const parsedText = parseTagsInText(textCharactersWithTags);
  return parsedText;
}

export function getFullLocaleText(
  textProps: LocaleTextProps,
  items: LocaleItem[]
): LocaleText {
  const { item: originItem, formula, lang, variables = {}, key } = textProps;
  const item = originItem
    ? originItem
    : items && key
    ? findItemByKey(key, items)
    : undefined;
  const parsedText = getParseText({ item, formula, lang, variables }, items);
  const characters = parsedText ? parsedText.characters : undefined;
  return {
    key,
    formula,
    lang,
    variables,
    characters,
  };
}
