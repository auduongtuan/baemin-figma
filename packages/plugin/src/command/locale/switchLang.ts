import * as h from "../commandHelper";
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
  const localeItem = findItemByKey(getKey(textNode), localeItems) || findItemByCharacters(textNode.characters, localeItems);
  updateTextNode(textNode, {lang}, localeItem);
}
function switchLang(lang: Lang, localeItems: LocaleItem[]) {
  h.selection().forEach((selection) => {
    if (h.isText(selection)) {
      changeLang(selection, lang, localeItems);
    } else if (h.isContainer(selection)) {
      const texts = selection.findAll((node) => h.isText(node)) as TextNode[];
      texts.forEach((textNode) => {
        changeLang(textNode, lang, localeItems);
      });
    }
  });
  figma.notify(`Switched selection to ${LANGUAGES[lang]}`);
  updateSelection();
}

export default switchLang;