import * as h from "../commandHelper";
import { MIXED_VALUE } from "../../constant/locale";
import { LocaleText } from "../../lib/localeData";
import { getLang, getKey, getVariables, getTextNodes } from "./common";
/*
 * TODO: Optimize update selection 
 */
function updateSelection() {
  const allTextNodes: TextNode[] = getTextNodes();
  if (allTextNodes && allTextNodes.length > 0) {
    const texts: LocaleText[] = allTextNodes.reduce((acc, textNode) => {
      acc.push({
        id: textNode.id,
        key: getKey(textNode),
        lang: getLang(textNode),
        variables: getVariables(textNode),
        characters: textNode.characters
      });
      return acc;
      }, []);
    h.postData({
      type: "change_locale_selection",
      texts: texts
    });
  }
  else {
    h.postData({ type: "change_locale_selection", texts: [] });
  }
}
export default updateSelection;
