import * as h from "figma-helpers";
import { LANGUAGES } from "../../constant/locale";
import {
  findItemByKey,
  findItemByCharacters, LocaleItem,
  Lang
} from "../../lib/localeData";
import updateSelection from "./updateSelection";
import { getKey, setLang } from "./common";
import updateText, { updateTextNode } from "./updateText";
function changeLang(
  textNode: TextNode,
  lang,
  localeItems: LocaleItem[]
) {
  const localeItem = findItemByKey(getKey(textNode), localeItems);
  // turn off find by characters because of speed
  //  || findItemByCharacters(textNode.characters, localeItems);
  if(localeItem) updateTextNode(textNode, {lang, item: localeItem});
}
function switchLang(lang: Lang, localeItems: LocaleItem[], scope?: SceneNode | BaseNode) {
  const updateNodes = scope ? [scope] : h.selection();
  updateNodes.forEach((selection) => {
    if (h.isText(selection)) {
      changeLang(selection, lang, localeItems);
    } else if (h.isContainer(selection)) {
      const texts = selection.findAllWithCriteria({types: ['TEXT']}) as TextNode[];
      texts.forEach((textNode) => {
        changeLang(textNode, lang, localeItems);
      });
    }
  });
  figma.notify(`Switched selection to ${LANGUAGES[lang]}`);
  updateSelection();
}

export default switchLang;