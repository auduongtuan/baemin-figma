import {
  LocaleItem,
  LocaleJsonFormat,
  isPlurals,
  Lang,
  LocaleText,
  matchFormula,
  getVariableNamesFromItemContent,
} from ".";
// import Prism from "prismjs";
// import "prismjs/components/prism-json";
// import { Token } from "prismjs";
// import { Token } from "prismjs";
import { set } from "lodash-es";
import { compareTimeAsc } from "./helpers";
import { formatNumbersInVariables } from "./localeTextVariable";

export function getTCode(text: LocaleText, allItems?: LocaleItem[]) {
  if (!text) return "";
  const { key, lang, formula, variables } = text;
  const formattedVariables = formatNumbersInVariables(variables, lang);
  if (formula) {
    let parsedFormulaCode = formula;
    matchFormula(formula, allItems, (item, match) => {
      const newLocaleItemContent =
        item && lang in item ? item[lang] : undefined;
      let variablesInFormulaItem = {};
      if (newLocaleItemContent) {
        const variableNamesInFormulaItem =
          getVariableNamesFromItemContent(newLocaleItemContent);
        variablesInFormulaItem = variableNamesInFormulaItem.reduce(
          (acc, name) => {
            acc[name] = formattedVariables[name];
            return acc;
          },
          {}
        );
      }
      parsedFormulaCode = parsedFormulaCode.replace(
        match[0],
        "${" +
          getTCode({
            key: match[1],
            lang,
            variables: variablesInFormulaItem,
          }) +
          "}"
      );
    });
    return "`" + parsedFormulaCode + "`";
  }
  return `t("${key}"${
    lang && Object.keys(formattedVariables).length > 0
      ? `, ${JSON.stringify(formattedVariables)}`
      : ""
  })`;
}

export function getLangJSON(
  items: LocaleItem[],
  lang: Lang,
  format: LocaleJsonFormat
) {
  return JSON.stringify(
    items
      .sort(
        (a, b) =>
          compareTimeAsc(a.updatedAt, b.updatedAt) ||
          compareTimeAsc(a.createdAt, b.createdAt)
        // cu truoc moi sau
      )
      .reduce((acc, item) => {
        if (isPlurals(item[lang])) {
          if (format == "i18next") {
            Object.keys(item[lang]).forEach((quantity) => {
              // set one as default
              if (quantity === "one") {
                set(acc, `${item.key}`, item[lang][quantity]);
              } else {
                set(acc, `${item.key}_${quantity}`, item[lang][quantity]);
              }
            });
          } else if (format == "i18n-js") {
            Object.keys(item[lang]).forEach((quantity) => {
              set(acc, `${item.key}.${quantity}`, item[lang][quantity]);
            });
          }
        } else {
          set(acc, item.key, item[lang]);
        }
        return acc;
      }, {}),
    null,
    2
  );
}
