import { isContainer, isText, selection } from "../commandHelper";
import { placeholders } from "../../lib/helpers";
import { PREFIX, DEFAULT_LANG } from "../../constant/locale";
import updateSelection from "./updateSelection";
import {
  Lang,
  LocaleItem,
  LocaleText,
  LocaleTextVariables,
} from "../../lib/localeData";
import { setKey, setLang, getLang, setVariables, getVariables } from "./common";
// find text node
export function updateTextNode(textNode: TextNode, updatedText: LocaleText, localeItem?: LocaleItem) {
  if (updatedText.key && !localeItem.key) setKey(textNode, updatedText.key);
  if (updatedText.lang) setLang(textNode, updatedText.lang || DEFAULT_LANG);
  if (updatedText.variables) setVariables(textNode, updatedText.variables);
  // update text content
  if (localeItem) {
    const currentLang = getLang(textNode) || DEFAULT_LANG;
    const variables = getVariables(textNode);
    setKey(textNode, localeItem.key);
    // NON PLURAL
    if (!localeItem.plurals) {
      if (variables && localeItem[currentLang]) {
        textNode.characters = placeholders(
          localeItem[currentLang],
          variables
        );
      } else {
        textNode.characters = localeItem[currentLang];
      }
    } 
    // PLURAL FORM
    else {
      if (variables && 'count' in variables) {
        const count = typeof variables.count == 'string' ? parseInt(variables.count) : variables.count;
        if(count == 1 && 'one' in localeItem.plurals) {
          textNode.characters = placeholders(
            localeItem.plurals.one[currentLang],
            variables
          );
        }
        if(count != 1 && 'other' in localeItem.plurals) {
          textNode.characters = placeholders(
            localeItem.plurals.other[currentLang],
            variables
          );
        }
      }
    }
  }
}
export function updateText(
  filterFunction: (node: TextNode) => boolean,
  updatedText: LocaleText,
  localeItem: LocaleItem,
  scope: SceneNode | BaseNode
) {
  const updateNodes = scope ? [scope] : selection();
  updateNodes.forEach((parentNode) => {
    let textNode: TextNode;
    if (isContainer(parentNode) || parentNode.type == "PAGE") {
      textNode = parentNode.findOne(
        (node) => isText(node) && filterFunction(node)
      ) as TextNode;
    } else if (isText(parentNode)) {
      textNode = parentNode;
    } else {
      return;
    }
    if (textNode) {
      updateTextNode(textNode, updatedText, localeItem);
    }
  });
}
export function updateTextById(
  text: {
    id: string;
    key: string;
    lang: Lang;
    variables: LocaleTextVariables;
  },
  localeItem: LocaleItem,
  scope?: SceneNode | BaseNode
) {
  const filterFunction = (node: TextNode) => node.id == text.id;
  updateText(filterFunction, text, localeItem, scope);
  // updateSelection();
  // update that text in state
}
export default updateText;
