import { getLocaleData, isDataNode, parseDataNodeInfo } from "./localeData";
import {
  LocaleItem,
  LocaleJsonFormat,
  getLangJSON,
  getLangsInItems,
  getTCode,
} from "@lib";
import { getKey, getLang, getVariables, getFormula } from "../text/textProps";
import { isContainer } from "figma-helpers";
import { getItemsFromTexts, getTexts } from "../text/textNodes";

function getJSONCodegen(
  items: LocaleItem[],
  format: LocaleJsonFormat
): CodegenResult[] {
  const langs = getLangsInItems(items);
  return langs.map((lang) => ({
    title: "i18n JSON" + (lang ? ` - ${lang}` : ""),
    language: "JSON",
    code: getLangJSON(items, lang, format),
  }));
}

function codegenHandle({ node, language }: CodegenEvent): CodegenResult[] {
  if (!node) {
  }
  const format =
    !language || (language !== "i18next" && language !== "i18n-js")
      ? "i18next"
      : language;
  if (isDataNode(node)) {
    const dataNodeInfo = parseDataNodeInfo(node);
    return getJSONCodegen(dataNodeInfo.items, format);
  }
  if (isContainer(node)) {
    const texts = getTexts(node);
    const allItems = getLocaleData().localeItems;
    const items = getItemsFromTexts(texts, allItems);
    return getJSONCodegen(items, format);
  }
  if (node.type !== "TEXT") return [];
  const key = getKey(node);
  const formula = getFormula(node);
  const lang = getLang(node);
  const variables = getVariables(node);
  if (!formula && !key) return [];
  if (formula) {
    const allItems = getLocaleData().localeItems;
    return [
      {
        title: "i18n formula",
        language: "PLAINTEXT",
        code: formula,
      },
      {
        title: "i18n t function",
        language: "JAVASCRIPT",
        code: getTCode({ variables, lang, formula }, allItems),
      },
    ];
  }
  return [
    {
      title: "i18n key",
      language: "PLAINTEXT",
      code: key,
    },
    {
      title: "i18n t function",
      language: "JAVASCRIPT",
      code: getTCode({ key, variables, lang }),
    },
  ];
}

export default codegenHandle;
