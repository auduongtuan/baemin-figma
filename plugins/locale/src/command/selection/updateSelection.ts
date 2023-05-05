import * as h from "figma-helpers";
import { LocaleText } from "../../lib";
import { getFormula, getKey, getLang, getVariables } from "../text/textProps";

export function getTextNodes(scope?: BaseNode | BaseNode[]): TextNode[] {
  const updateNodes = scope
    ? Array.isArray(scope)
      ? [...scope]
      : [scope]
    : h.selection();
  const textNodes: TextNode[] = [];
  updateNodes.forEach((parentNode) => {
    if (h.isContainer(parentNode) || parentNode.type == "PAGE") {
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

/*
 * TODO: Optimize update selection
 */
function updateSelection() {
  const allTextNodes: TextNode[] = getTextNodes();
  if (allTextNodes && allTextNodes.length > 0) {
    const texts: LocaleText[] = allTextNodes.reduce((acc, textNode) => {
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
    h.postData({
      type: "change_locale_selection",
      texts: texts,
    });
  } else {
    h.postData({ type: "change_locale_selection", texts: [] });
  }
}
export default updateSelection;
