import * as h from "figma-helpers";
import { DEFAULT_LANG, PREFIX } from "../../lib/constant";
import {
  Lang,
  LocaleItem,
  LocaleTextStyles,
  LocaleTextVariables,
  getTextPropsByCharacters,
} from "../../lib";

export function getLang(node: TextNode): Lang {
  const lang = h.getNodeData(node, `${PREFIX}lang`);
  if (lang == "en" || lang == "vi") {
    return lang;
  } else {
    return DEFAULT_LANG;
  }
}
export function getVariables(node: TextNode): LocaleTextVariables {
  const string = h.getNodeData(node, `${PREFIX}variables`);
  return string ? JSON.parse(string) : {};
}
export function getStyles(node: TextNode): LocaleTextStyles {
  const string = h.getNodeData(node, `${PREFIX}variables`);
  return string ? JSON.parse(string) : {};
}
export function getVariable(node: TextNode, variableName?: string) {
  const variables = getVariables(node);
  if (variableName && variableName in variables) {
    return variables[variableName];
  } else {
    return null;
  }
}
export function setVariables(node: TextNode, variables: LocaleTextVariables) {
  h.setNodeData(node, `${PREFIX}variables`, JSON.stringify(variables));
}
export function setVariable(
  node: TextNode,
  variableName: string,
  variableValue: number | string
) {
  setVariables(node, {
    ...getVariables(node),
    [variableName]: variableValue,
  });
}

export function setLang(node: TextNode, lang: string) {
  h.setNodeData(node, `${PREFIX}lang`, lang);
}
export function getKey(node: TextNode) {
  return h.getNodeData(node, `${PREFIX}key`);
}
export function setKey(node: TextNode, key: string) {
  h.setNodeData(node, `${PREFIX}key`, key);
}
export function getFormula(node: TextNode) {
  return h.getNodeData(node, `${PREFIX}formula`);
}
export function setFormula(node: TextNode, formula: string) {
  h.setNodeData(node, `${PREFIX}formula`, formula);
}

export function autoSetKey(
  textNode: TextNode,
  localeItems: LocaleItem[],
  callback?: Function
) {
  const { item, lang, variables } = getTextPropsByCharacters(
    textNode.characters,
    localeItems
  );
  if (item) {
    if (getKey(textNode) != item.key) {
      setKey(textNode, item.key);
      setLang(textNode, lang);
      setVariables(textNode, variables);
      if (callback) callback();
    }
  }
}

// export function checkNodeVisible(node: SceneNode) {
//   return (
//     node.visible &&
//     (!node.parent ||
//       !h.isContainer(node.parent) ||
//       (h.isContainer(node.parent) && node.parent.visible)) &&
//     (!node.parent.parent ||
//       !h.isContainer(node.parent.parent) ||
//       (h.isContainer(node.parent.parent) && node.parent.parent.visible)) &&
//     (!node.parent.parent.parent ||
//       !h.isContainer(node.parent.parent.parent) ||
//       (h.isContainer(node.parent.parent.parent) &&
//         node.parent.parent.parent.visible))
//   );
// }
