import { isContainer, isText, selection } from "../commandHelper";
import { PREFIX, DEFAULT_LANG } from "../../constant/locale";
import updateSelection from "./updateSelection";
import { Lang, LocaleItem } from "../../lib/localeData";
import { setKey, setLang, getLang } from "./common";
// find text node
function updateText(
  msg: { id: string; key: string; lang: Lang; localeItem: LocaleItem },
  scope?: SceneNode | BaseNode
) {
  const updateNodes = scope ? [scope] : selection();
  updateNodes.forEach((parentNode) => {
    let textNode: TextNode;
    if (isContainer(parentNode) || parentNode.type == "PAGE") {
      textNode = parentNode.findOne(
        (node) => isText(node) && node.id == msg.id
      ) as TextNode;
    }
    else if (isText(parentNode)) {
      textNode = parentNode;
    } else {
      return;
    }
    if (textNode) {
      if (msg.key) setKey(textNode, msg.key);
      setLang(textNode, msg.lang || DEFAULT_LANG);
      // update text content
      if (msg.localeItem) {
        console.log("Locale item changed", msg.localeItem);
        const currentLang = getLang(textNode) || DEFAULT_LANG;
        setKey(textNode, msg.localeItem.key);
        if (currentLang) textNode.characters = msg.localeItem[currentLang];
      }
    }
  });
  // updateSelection();
  // update that text in state
}
export default updateText;
