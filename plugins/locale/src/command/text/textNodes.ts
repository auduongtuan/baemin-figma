import { getKey, getLang, getFormula, getVariables } from "./textProps";
import {
  findItemByKey,
  type LocaleText,
  LocaleItemOptionalDuplicated,
} from "../../lib";
import { selection, isContainer } from "figma-helpers";

export function getTextNodes(scope?: BaseNode | BaseNode[]): TextNode[] {
  const updateNodes = scope
    ? Array.isArray(scope)
      ? [...scope]
      : [scope]
    : selection();
  const textNodes: TextNode[] = [];
  updateNodes.forEach((parentNode) => {
    if (
      isContainer(parentNode) ||
      parentNode.type == "COMPONENT_SET" ||
      parentNode.type == "PAGE"
    ) {
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

export function getTextsFromTextNodes(textNodes: TextNode[]): LocaleText[] {
  return textNodes.reduce((acc, textNode) => {
    if (textNode.characters) {
      acc.push({
        id: textNode.id,
        key: getKey(textNode),
        lang: getLang(textNode),
        formula: getFormula(textNode),
        variables: getVariables(textNode),
        characters: textNode.characters,
      });
    }
    return acc;
  }, []);
}
export function getTexts(scope?: BaseNode | BaseNode[]): LocaleText[] {
  const textNodes = getTextNodes(scope || figma.currentPage);
  return getTextsFromTextNodes(textNodes);
}

export function getItemsFromTexts(
  texts: LocaleText[],
  allItems: LocaleItemOptionalDuplicated[]
) {
  return texts.reduce<LocaleItemOptionalDuplicated[]>((acc, text) => {
    const item = findItemByKey(text.key, allItems);
    if (item) {
      acc.push(item);
    }
    return acc;
  }, []);
}
