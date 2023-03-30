import { isContainer, isText, selection } from "../commandHelper";
import { placeholders } from "../../lib/helpers";
import { DEFAULT_LANG } from "../../constant/locale";
import {
  Lang,
  LocaleItem,
  LocaleText,
  LocaleTextVariables,
  findItemByKey,
  isPlurals,
  getTextCharacters
} from "../../lib/localeData";
import { setKey, setLang, getLang, getKey, setVariables, getVariables, setVariable } from "./common";
import { isString } from "lodash";
// find text node
export function updateTextNode(textNode: TextNode, textProps: Omit<LocaleText, "id">) {
  if(textProps) {
    if (textProps.key && (!textProps.item && !textProps.item.key)) {
      setKey(textNode, textProps.key);
    }
    if (textProps.key === '') setKey(textNode, textProps.key);
    if (textProps.lang) setLang(textNode, textProps.lang || DEFAULT_LANG);
    if (textProps.variables) setVariables(textNode, textProps.variables);
  }
  // update text content
  if (textProps.item) {
    const currentLang = getLang(textNode) || DEFAULT_LANG;
    const localeItemContent = textProps.item[currentLang];
    const variables = getVariables(textNode);
    if(isPlurals(localeItemContent) && !variables.count) {
      setVariable(textNode, 'count', 1);
      variables.count = 1;
    }
    setKey(textNode, textProps.item.key); 
    // NON PLURAL
    textNode.characters = getTextCharacters(localeItemContent, variables);
  }
}
// update texts to use Locale item
export function updateText(
  filterFunction: (node: TextNode) => boolean,
  textProps: Omit<LocaleText, "id">,
  scope: SceneNode | BaseNode
) {
  const updateNodes = scope ? [scope] : selection();
  const textNodes: TextNode[] = [];
  updateNodes.forEach((parentNode) => {
    if (isContainer(parentNode) || parentNode.type == "PAGE") {
      textNodes.push(...parentNode.findAllWithCriteria({types: ['TEXT']}) as TextNode[]);
    } 
    if (parentNode.type == 'TEXT') {
      textNodes.push(parentNode);
    }
  });
  textNodes.filter(filterFunction).forEach(textNode => {
    updateTextNode(textNode, textProps);
    console.log('UpdateText - Locale item', textProps.item);
  })
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
      textNodes.push(...parentNode.findAllWithCriteria({types: ['TEXT']}) as TextNode[]);
    } 
    if (parentNode.type == 'TEXT') {
      textNodes.push(parentNode);
    }
   
  });
  textNodes.forEach(textNode => {
    const key = getKey(textNode);
    if(!key) return;
    // update text content
    const localeItem = findItemByKey(getKey(textNode), localeItems);
    if (localeItem) {
      updateTextNode(textNode, {item: localeItem});
    }
  })
}
export function updateTextByIds(
  ids: string[],
  textProps: Omit<LocaleText, "id">,
  scope?: SceneNode | BaseNode
) {
  const filterFunction = (node: TextNode) => (isString(ids) && node.id == ids) || ids.includes(node.id);
  updateText(filterFunction, textProps, scope);
  // updateSelection();
  // update that text in state
}
export default updateText;
