import * as h from "figma-helpers";
import { LANGUAGES } from "../../lib/constant";
import { LocaleItem, Lang, findItemByKey } from "../../lib";
import updateSelection from "./updateSelection";
import { getFormula, getKey } from "../text/textProps";
import { updateTextNode } from "../text/updateText";
function changeLang(textNode: TextNode, lang: Lang, localeItems: LocaleItem[]) {
  const formula = getFormula(textNode);
  // turn off find by characters because of speed
  //  || findItemByCharacters(textNode.characters, localeItems);
  if (formula) {
    updateTextNode(textNode, { lang, formula: formula, items: localeItems });
  } else {
    const localeItem = findItemByKey(getKey(textNode), localeItems);
    if (localeItem) updateTextNode(textNode, { lang, item: localeItem });
  }
}
function switchLang(
  lang: Lang,
  localeItems: LocaleItem[],
  scope?: SceneNode | BaseNode
) {
  const updateNodes = scope ? [scope] : h.selection();
  updateNodes.forEach((selection) => {
    if (h.isText(selection)) {
      changeLang(selection, lang, localeItems);
    } else if (h.isContainer(selection)) {
      const texts = selection.findAllWithCriteria({
        types: ["TEXT"],
      }) as TextNode[];
      texts.forEach((textNode) => {
        changeLang(textNode, lang, localeItems);
      });
    }
  });
  figma.notify(`Switched selection to ${LANGUAGES[lang]}`);
  updateSelection();
}

export default switchLang;
