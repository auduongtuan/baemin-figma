import { CODE_FRAME_NAME, LANGUAGES, PREFIX } from "../../constant/locale";
import { LocaleItem, LocaleLibrary, isPlurals } from "../../lib/localeData";
import { js_beautify } from "js-beautify";
import { setNodeData, loadRobotoFontsAsync, getNodeData } from "figma-helpers";
import { set } from "lodash";
const firstPage = figma.root.children[0];
import updateCodeHighlighter from "figma-helpers/codeHighlighter";
import { Token } from "prismjs";
import { hexToFigmaRGB } from "figma-helpers/colors";
// async function exportCode(tokensObject: {[key:string]: Array<string | Token>}) {
async function printCodeBlock(
  library: LocaleLibrary,
  langJSONs: { [key: string]: string },
) {
  await loadRobotoFontsAsync("Sans", "Bold");
  await loadRobotoFontsAsync("Mono", "Regular");
  let localeCodeBlock =
    (firstPage.findOne(
      (node) =>
        getNodeData(node, `${PREFIX}code`) == "1" &&
        getNodeData(node, `${PREFIX}library_id`) == library.id
    ) as FrameNode) || null;
  if (!localeCodeBlock) {
    localeCodeBlock = figma.createFrame();
  }
  setNodeData(localeCodeBlock, `${PREFIX}code`, "1");
  setNodeData(localeCodeBlock, `${PREFIX}library_id`, library.id);
  firstPage.appendChild(localeCodeBlock);
  // }
  const paint: SolidPaint = {
    type: "SOLID",
    color: hexToFigmaRGB("#FFF"),
  };
  console.log("Print code block");
  localeCodeBlock.name = `${library.name} JSON`;
  localeCodeBlock.resize(1400, 800);
  localeCodeBlock.fills = [paint];
  localeCodeBlock.layoutMode = "VERTICAL";
  localeCodeBlock.primaryAxisSizingMode = "AUTO";
  localeCodeBlock.counterAxisSizingMode = "AUTO";
  localeCodeBlock.itemSpacing = 24;
  localeCodeBlock.paddingTop = 24;
  localeCodeBlock.paddingBottom = 24;
  localeCodeBlock.paddingLeft = 24;
  localeCodeBlock.paddingRight = 24;
  localeCodeBlock.children.forEach((child) => {
    child.remove();
  });

  const namespaceTextNode = figma.createText();
  namespaceTextNode.name = `${library.name}`;
  namespaceTextNode.fontName = { family: "Roboto", style: "Bold" };
  namespaceTextNode.fontSize = 24;
  namespaceTextNode.characters = library.name;
  namespaceTextNode.textAutoResize = "HEIGHT";
  namespaceTextNode.layoutAlign = "STRETCH";

  localeCodeBlock.appendChild(namespaceTextNode);

  const localeCodes = figma.createFrame();
  localeCodes.fills = [paint];
  localeCodes.resize(1400, 800);
  localeCodes.layoutMode = "HORIZONTAL";
  localeCodes.counterAxisSizingMode = "AUTO";
  localeCodes.itemSpacing = 36;
  localeCodes.name = CODE_FRAME_NAME;

  localeCodeBlock.appendChild(localeCodes);
  Object.keys(LANGUAGES).forEach((lang) => {
    const langFrame = figma.createFrame();
    langFrame.fills = [paint];
    langFrame.resize(700, 800);
    langFrame.layoutGrow = 1;
    langFrame.layoutMode = "VERTICAL";
    langFrame.counterAxisSizingMode = "AUTO";
    langFrame.itemSpacing = 16;
    langFrame.name = `${LANGUAGES[lang]}`;

    const headingTextNode = figma.createText();
    headingTextNode.name = `HEADING ${lang}`;
    headingTextNode.fontName = { family: "Roboto", style: "Bold" };
    headingTextNode.fontSize = 16;
    headingTextNode.characters = LANGUAGES[lang];
    headingTextNode.textAutoResize = "HEIGHT";
    headingTextNode.layoutAlign = "STRETCH";

    langFrame.appendChild(headingTextNode);
    const codeTextNode = figma.createText();
    codeTextNode.name = `CODE ${lang}`;
    codeTextNode.fontName = { family: "Roboto Mono", style: "Regular" };
    codeTextNode.fontSize = 12;
    codeTextNode.lineHeight = {
      value: 14,
      unit: 'PIXELS'
    };
    codeTextNode.textAutoResize = "HEIGHT";
    langFrame.appendChild(codeTextNode);
    codeTextNode.resizeWithoutConstraints(700, 400);
    codeTextNode.layoutAlign = "STRETCH";
    codeTextNode.textAutoResize = "HEIGHT";
    codeTextNode.characters = langJSONs[lang];
    // updateCodeHighlighter(codeTextNode, tokensObject[lang]);
    localeCodes.appendChild(langFrame);
  });
  figma.notify("Code generated");
}
export default printCodeBlock;
