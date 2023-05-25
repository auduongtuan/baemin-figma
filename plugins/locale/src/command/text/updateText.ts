import { isContainer, selection } from "figma-helpers";
import { isString } from "lodash-es";
import {
  LocaleTextProps,
  findItemByKey,
  getParsedText,
  getTextCharactersWithTags,
  isPlurals,
} from "../../lib";
import changeText from "figma-helpers/changeText";
import {
  getFormula,
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
import configs from "figma-helpers/configs";
// find text node
export function updateTextNode(
  textNode: TextNode,
  textProps: LocaleTextProps,
  callback: Function = undefined
) {
  if (!textProps) return;
  // setup key
  if (textProps.key || textProps.key === "") {
    setKey(textNode, textProps.key);
  }
  // setup lang
  const oldLang = getLang(textNode) || configs.get("defaultLanguage");
  if (textProps.lang) {
    setLang(textNode, textProps.lang);
  }
  const newLang = textProps.lang || oldLang;
  // setup formula
  if (typeof textProps.formula != "undefined") {
    setFormula(textNode, textProps.formula || "");
  }
  const formula = getFormula(textNode);
  // setup item
  const item =
    textProps.item || findItemByKey(getKey(textNode), textProps.items);
  // setup variables
  if (textProps.variables) setVariables(textNode, textProps.variables);
  const variables = getVariables(textNode);
  // update text content
  const isFormula = formula && textProps.items;
  if (item || isFormula) {
    const props = {
      formula: formula,
      items: textProps.items,
      item,
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
    changeText(textNode, parsedText.characters).then(() => {
      if (parsedText.hasTags) {
        setStyles(textNode, parsedText, oldStyles);
      }
      callback && callback();
    });
  }
}
export function getTextNodesInScope(scope?: SceneNode | BaseNode) {
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
  return textNodes;
}

export function updateTextsAsync(
  textProps: LocaleTextProps,
  ids?: string | string[] | null,
  scope?: SceneNode | BaseNode
) {
  const filterFunction = (node: TextNode) =>
    (isString(ids) && node.id == ids) || ids.includes(node.id);
  const textNodes = ids
    ? getTextNodesInScope(scope).filter(filterFunction)
    : getTextNodesInScope(scope);
  const promiseList = textNodes.map(
    (textNode) =>
      new Promise((resolve) => {
        updateTextNode(textNode, textProps, () => {
          resolve(true);
        });
      })
  );
  return Promise.allSettled(promiseList);
}

export default updateTextsAsync;
