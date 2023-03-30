import * as h from "../commandHelper";
import { PREFIX, DEFAULT_LANG, LANGUAGES } from "../../constant/locale";
import {
  LocaleTextVariables,
  findItemByKey,
  findItemByCharacters,
  findItemByKeyOrCharacters,
  LocaleItem,
  Lang,
  findVariablesInCharacters,
  getTextByCharacter,
} from "../../lib/localeData";
import updateSelection from "./updateSelection";
import { isArray } from "lodash";
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
    [variableName]: variableValue 
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


export function autoSetKey(
  textNode: TextNode,
  localeItems: LocaleItem[],
  callback?: Function
) {
  const {item, lang, variables} = getTextByCharacter(textNode.characters, localeItems);
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


export function getTextNodes(scope?: BaseNode | BaseNode[]): TextNode[] {
  const updateNodes = scope ? (isArray(scope) ? [...scope] : [scope]) : h.selection();
  const textNodes: TextNode[] = [];
  updateNodes.forEach((parentNode) => {
    if (h.isContainer(parentNode) || parentNode.type == "PAGE") {
      textNodes.push(...parentNode.findAllWithCriteria({types: ['TEXT']}) as TextNode[]);
    } 
    if (parentNode.type == 'TEXT') {
      textNodes.push(parentNode);
    }
  });
  return textNodes;
}
