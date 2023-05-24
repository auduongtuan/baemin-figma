import * as h from "figma-helpers";
import { LANGUAGE_LIST } from "../../lib/constant";
import { LocaleItem, Lang, findItemByKey } from "../../lib";
import updateSelection from "./updateSelection";
import { getFormula, getKey } from "../text/textProps";
import { updateTextNode, getTextNodesInScope } from "../text/updateText";
function changeLang(
  textNode: TextNode,
  lang: Lang,
  localeItems: LocaleItem[],
  callback?: Function
) {
  const formula = getFormula(textNode);
  // turn off find by characters because of speed
  //  || findItemByCharacters(textNode.characters, localeItems);
  if (formula) {
    updateTextNode(
      textNode,
      { lang, formula: formula, items: localeItems },
      callback
    );
  } else {
    const localeItem = findItemByKey(getKey(textNode), localeItems);
    if (localeItem)
      updateTextNode(textNode, { lang, item: localeItem }, callback);
  }
}
async function switchLang(
  lang: Lang,
  localeItems: LocaleItem[],
  scope?: SceneNode | BaseNode
) {
  const textNodes = getTextNodesInScope(scope);
  const promiseList = textNodes.map(
    (textNode) =>
      new Promise((resolve) => {
        changeLang(textNode, lang, localeItems, () => {
          resolve(true);
        });
      })
  );
  Promise.allSettled(promiseList).then(() => {
    figma.notify(`Switched selection to ${LANGUAGE_LIST[lang]}`);
    updateSelection();
  });
}

export default switchLang;
