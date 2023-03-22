import { CODE_FRAME_NAME, PREFIX } from "../../constant/locale";
import { LocaleItem } from "../../lib/localeData";
import { js_beautify } from "js-beautify";
import { setNodeData, loadRobotoFontsAsync, getNodeData } from "../commandHelper";
const firstPage = figma.root.children[0];
async function exportCode(localeItems: LocaleItem[]) {
  await loadRobotoFontsAsync();
  let localeCodeFrame =
    (firstPage.findOne(
      (node) => getNodeData(node, `${PREFIX}code`) != ""
    ) as FrameNode) || null;
  if (!localeCodeFrame) {
    localeCodeFrame = figma.createFrame();
    localeCodeFrame.resize(700, 800);
    localeCodeFrame.name = CODE_FRAME_NAME;
    setNodeData(localeCodeFrame, `${PREFIX}code`, "1");
    firstPage.appendChild(localeCodeFrame);
  }
  const viJSON = JSON.stringify(
    localeItems.reduce((acc, item) => {
      acc[item.key] = item.vi;
      return acc;
    }, {})
  );
  let codeTextNode =
    (localeCodeFrame.findOne(
      (node) => node.type == "TEXT"
    ) as TextNode) || null;
  if (!codeTextNode) {
    codeTextNode = figma.createText();
    codeTextNode.name = "CODE";
    codeTextNode.fontName = { family: "Roboto Mono", style: "Regular" };
    codeTextNode.textAutoResize = "HEIGHT";
    localeCodeFrame.appendChild(codeTextNode);
  }
  codeTextNode.resizeWithoutConstraints(700, 400);
  codeTextNode.textAutoResize = "HEIGHT";
  codeTextNode.characters = js_beautify(viJSON);
  figma.notify("Code generated");
}
export default exportCode;