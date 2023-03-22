import { isContainer, isText, selection } from "../commandHelper";
import { PREFIX, DEFAULT_LANG } from "../../constant/locale";
import updateSelection from "./updateSelection";
import { Lang, LocaleItem, findItemByKey } from "../../lib/localeData";
import { setKey, setLang, getLang, getKey } from "./common";
// find text node
function updateTexts(
  localeItems: LocaleItem[],
  scope?: SceneNode | BaseNode
) {
  const updateNodes = scope ? [scope] : selection();
  updateNodes.forEach((parentNode) => {
    if (!isContainer(parentNode) && parentNode.type != "PAGE") return;
    const textNodes = parentNode.findAll(
      (node) => isText(node) && getKey(node) != ''
    ) as TextNode[];
    textNodes.forEach(textNode => {
      // update text content
      const localeItem = findItemByKey(getKey(textNode), localeItems);
      if (localeItem) {
        const currentLang = getLang(textNode) || DEFAULT_LANG;
        if (currentLang in localeItem) textNode.characters = localeItem[currentLang];
      }
    })
  });
}
export default updateTexts;
