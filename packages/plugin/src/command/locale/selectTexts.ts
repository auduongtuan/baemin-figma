import { isText } from "../commandHelper";
import { getKey } from "./common";
import { pluralize } from "@capaj/pluralize";
function selectTexts(key: string) {
  if (key) {
    figma.notify(`Finding texts with key ${key}...`)
    const textNodes = figma.currentPage.findAll(
      (node) => isText(node) && getKey(node) == key
    );
    figma.currentPage.selection = [...textNodes];
    figma.notify(`${textNodes.length} ${pluralize('text', textNodes.length)} selected`);
  }
}
export default selectTexts;