import { isContainer, selection } from "figma-helpers";
import { isString } from "lodash";
import { DEFAULT_LANG } from "../../constant/locale";
import { matchAll } from "../../lib/helpers";
import {
  Lang,
  LocaleItem,
  LocaleTextProps,
  LocaleTextVariables,
} from "../../lib";
import { findItemByKey, isPlurals } from "../../lib/localeItem";
import { applyVariablesToContent } from "../../lib/localeText";
import {
  getKey,
  getLang,
  getVariables,
  setFormula,
  setKey,
  setLang,
  setVariable,
  setVariables,
} from "./textProps";
import parseTagsInText from "./parseTagsInText";
import { getStyles, setStyles } from "./textStyles";

function parseFormula(textProps: LocaleTextProps) {
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

function getTextCharactersWithTags(
  textProps: LocaleTextProps,
  lang: Lang,
  variables: LocaleTextVariables = {}
) {
  return textProps.formula
    ? parseFormula({ ...textProps, lang: lang })
    : applyVariablesToContent(textProps.item[lang], variables);
}
// find text node
export function updateTextNode(textNode: TextNode, textProps: LocaleTextProps) {
  if (!textProps) return;
  if (textProps.key || textProps.key === "") {
    setKey(textNode, textProps.key);
  }
  const oldLang = getLang(textNode) || DEFAULT_LANG;
  const newLang = textProps.lang || oldLang;
  if (newLang != oldLang) {
    setLang(textNode, newLang);
  }
  if (typeof textProps.formula != "undefined") {
    setFormula(textNode, textProps.formula || "");
  }
  if (textProps.variables) setVariables(textNode, textProps.variables);
  // update text content
  const isFormula = textProps.formula && textProps.items;
  if (textProps.item || isFormula) {
    const variables = getVariables(textNode);
    const oldTextCharactersWithTags = getTextCharactersWithTags(
      textProps,
      oldLang,
      variables
    );

    const oldStyles = textNode.characters
      ? getStyles(textNode, oldTextCharactersWithTags)
      : { bold: [], link: [] };
    if (
      textProps.item &&
      isPlurals(textProps.item[newLang]) &&
      !variables.count
    ) {
      setVariable(textNode, "count", 1);
      variables.count = 1;
    }
    const textCharactersWithTags = getTextCharactersWithTags(
      textProps,
      newLang,
      variables
    );
    const parsedText = parseTagsInText(textCharactersWithTags);
    textNode.characters = parsedText.characters;
    if (parsedText.hasTags) {
      setStyles(textNode, parsedText, oldStyles);
    }
  }
}
// update texts to use Locale item
export function updateText(
  filterFunction: (node: TextNode) => boolean,
  textProps: LocaleTextProps,
  scope: SceneNode | BaseNode
) {
  const updateNodes = scope ? [scope] : selection();
  const textNodes: TextNode[] = [];
  updateNodes.forEach((parentNode) => {
    if (isContainer(parentNode) || parentNode.type == "PAGE") {
      textNodes.push(
        ...(parentNode.findAllWithCriteria({ types: ["TEXT"] }) as TextNode[])
      );
    }
    if (parentNode.type == "TEXT") {
      textNodes.push(parentNode);
    }
  });
  textNodes.filter(filterFunction).forEach((textNode) => {
    updateTextNode(textNode, textProps);
  });
}
// update Texts to lastest content
export function updateTexts(
  localeItems: LocaleItem[],
  scope?: SceneNode | BaseNode
) {
  const updateNodes = scope ? [scope] : selection();
  const textNodes: TextNode[] = [];
  updateNodes.forEach((parentNode) => {
    if (isContainer(parentNode) || parentNode.type == "PAGE") {
      textNodes.push(
        ...(parentNode.findAllWithCriteria({ types: ["TEXT"] }) as TextNode[])
      );
    }
    if (parentNode.type == "TEXT") {
      textNodes.push(parentNode);
    }
  });
  textNodes.forEach((textNode) => {
    const key = getKey(textNode);
    if (!key) return;
    // update text content
    const localeItem = findItemByKey(getKey(textNode), localeItems);
    if (localeItem) {
      updateTextNode(textNode, { item: localeItem });
    }
  });
}
export function updateTextByIds(
  ids: string | string[],
  textProps: LocaleTextProps,
  scope?: SceneNode | BaseNode
) {
  const filterFunction = (node: TextNode) =>
    (isString(ids) && node.id == ids) || ids.includes(node.id);
  updateText(filterFunction, textProps, scope);
  // updateSelection();
  // update that text in state
}
export default updateText;
