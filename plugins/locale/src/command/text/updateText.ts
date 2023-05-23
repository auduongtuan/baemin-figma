import { isContainer, selection } from "figma-helpers";
import { isString } from "lodash-es";
import {
  LocaleItem,
  LocaleTextProps,
  findItemByKey,
  getParsedText,
  getTextCharactersWithTags,
  isPlurals,
} from "../../lib";
import { DEFAULT_LANG } from "../../lib/constant";
import changeText from "figma-helpers/changeText";
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
import { getStyles, setStyles } from "./textStyles";

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
    const props = {
      formula: textProps.formula,
      items: textProps.items,
      item: textProps.item,
      variables,
    };
    const oldTextCharactersWithTags = getTextCharactersWithTags({
      ...props,
      lang: oldLang,
    });

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
    const parsedText = getParsedText({
      ...props,
      lang: newLang,
    });
    changeText(textNode, parsedText.characters, () => {
      if (parsedText.hasTags) {
        setStyles(textNode, parsedText, oldStyles);
      }
    });
  }
}
// update texts to use Locale item
export function updateTextsInScope(
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
export function updateTextsByIds(
  ids: string | string[],
  textProps: LocaleTextProps,
  scope?: SceneNode | BaseNode
) {
  const filterFunction = (node: TextNode) =>
    (isString(ids) && node.id == ids) || ids.includes(node.id);
  updateTextsInScope(filterFunction, textProps, scope);
  // updateSelection();
  // update that text in state
}
export default updateTextsInScope;
