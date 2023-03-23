import * as h from "../commandHelper";
import { MIXED_VALUE } from "../../constant/locale";
import { LocaleText } from "../../lib/localeData";
import { getLang, getKey, checkNodeVisible, getVariables } from "./common";
/*
 * TODO: Optimize update selection 
 */
function updateSelection() {
  const selection = h.selection();
  const firstNode = h.selection(0);
  if (selection.length == 1 && h.isText(firstNode)) {
    const key = getKey(firstNode);
    const lang = getLang(firstNode);
    h.postData({
      type: "change_locale_selection",
      localeSelection: {
        multiple: false,
        summary: {
          key, 
          lang
        },
        texts: [{
          id: firstNode.id,
          key,
          lang,
          variables: getVariables(firstNode),
          characters: firstNode.characters,
        }]
      },
    });
  } else if (
    selection.length >= 1 ||
    (selection.length == 1 && h.isContainer(firstNode))
  ) {
    const allTexts: TextNode[] = selection.reduce((acc, selectionItem) => {
      if (h.isContainer(selectionItem)) {
        const textNodes = selectionItem.findAll((node) => h.isText(node));
        acc.push(...textNodes);
      }
      if (h.isText(selectionItem)) {
        acc.push(selectionItem);
      }
      return acc;
    }, []);
    console.log(allTexts);
    if (allTexts && allTexts.length > 0) {
      const firstLang = getLang(allTexts[0]);
      const firstKey = getKey(allTexts[0]);
      const isSameLang = allTexts.every(
        (textNode) => getLang(textNode) == firstLang
      );
      const isSameKey = allTexts.every(
        (textNode) => getKey(textNode) == firstKey
      );
      const texts: LocaleText[] = allTexts
        .filter(checkNodeVisible)
        .map((textNode) => ({
          id: textNode.id,
          key: getKey(textNode),
          lang: getLang(textNode),
          variables: getVariables(textNode),
          characters: textNode.characters,
        }));
      h.postData({
        type: "change_locale_selection",
        localeSelection: {
          multiple: true,
          summary: {
            lang: isSameLang ? firstLang : MIXED_VALUE,
            key: isSameKey ? firstKey : MIXED_VALUE,
          },
          texts: texts,
        },
      });
    }
  }
  // const firstLang = h.getNodeData(firstNode, `${PREFIX}lang`);
  // const firstKey = h.getNodeData(firstNode, `${PREFIX}key`);
  // let isSameLang = selection.every((node) => {
  //   return h.getNodeData(node, `${PREFIX}lang`) == firstLang;
  // });
  // if(isSameLang) {
  //   console.log('same lang');
  // } else {
  //   console.log('mixed lang');
  // }
  else {
    h.postData({ type: "change_locale_selection", localeSelection: null });
  }
}
export default updateSelection;
