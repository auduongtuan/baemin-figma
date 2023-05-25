import { getKey } from "../text/textProps";
import { pluralize } from "@capaj/pluralize";
function selectTexts(key: string) {
  if (key) {
    const allTextNodes = figma.currentPage.findAllWithCriteria({
      types: ["TEXT"],
    });
    const textNodes = allTextNodes.filter((node) => getKey(node) == key);
    figma.currentPage.selection = [...textNodes];
    figma.viewport.scrollAndZoomIntoView([...textNodes]);
    figma.notify(
      `${textNodes.length} ${pluralize("text", textNodes.length)} selected`
    );
  }
}
export default selectTexts;
