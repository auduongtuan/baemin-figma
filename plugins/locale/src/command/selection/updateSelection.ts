import io from "figma-helpers/io";
import { getTextNodes, getTextsFromTextNodes } from "../text/textNodes";
/*
 * TODO: Optimize update selection
 */
function updateSelection() {
  const allTextNodes: TextNode[] = getTextNodes();
  if (allTextNodes && allTextNodes.length > 0) {
    const texts = getTextsFromTextNodes(allTextNodes);
    console.log(texts);
    io.send("change_locale_selection", { texts: texts });
  } else {
    io.send("change_locale_selection", { texts: [] });
  }
}
export default updateSelection;
