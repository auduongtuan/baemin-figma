import { CODE_FRAME_NAME, LANGUAGES, PREFIX } from "../../constant/locale";
import { LocaleItem, isPlurals } from "../../lib/localeData";
import { js_beautify } from "js-beautify";
import { setNodeData, loadRobotoFontsAsync, getNodeData } from "figma-helpers";
import { set } from "lodash";
const firstPage = figma.root.children[0];
import updateCodeHighlighter from "figma-helpers/codeHighlighter";
import { Token } from "prismjs";
import { hexToFigmaRGB } from "figma-helpers/colors";
// async function exportCode(tokensObject: {[key:string]: Array<string | Token>}) {
async function exportCode(langJSONs: {[key:string]: string}) {
  await loadRobotoFontsAsync('Sans', 'Bold');
  await loadRobotoFontsAsync('Mono', 'Regular');
  let localeCodeFrame =
    (firstPage.findOne(
      (node) => getNodeData(node, `${PREFIX}code`) != ""
    ) as FrameNode) || null;
  if (!localeCodeFrame) {
    localeCodeFrame = figma.createFrame();
    setNodeData(localeCodeFrame, `${PREFIX}code`, "1");
    firstPage.appendChild(localeCodeFrame);
  }
  const paint: SolidPaint = {
    type: 'SOLID',
    color: hexToFigmaRGB('#EEEEEE')
  };
  localeCodeFrame.fills = [paint];
  localeCodeFrame.resize(1400, 800);
  localeCodeFrame.layoutMode = 'HORIZONTAL';
  localeCodeFrame.counterAxisSizingMode = "AUTO";
  localeCodeFrame.itemSpacing = 36;
  localeCodeFrame.name = CODE_FRAME_NAME;
  localeCodeFrame.paddingTop = 24;
  localeCodeFrame.paddingBottom = 24;
  localeCodeFrame.paddingLeft = 24;
  localeCodeFrame.paddingRight = 24;
  localeCodeFrame.children.forEach(child => {
    child.remove();
  })
 Object.keys(LANGUAGES).forEach(lang => {
    const langFrame = figma.createFrame();
    langFrame.fills = [paint];
    langFrame.resize(700, 800);
    langFrame.layoutGrow = 1;
    langFrame.layoutMode = 'VERTICAL';
    langFrame.counterAxisSizingMode = "AUTO";
    langFrame.itemSpacing = 16;
    langFrame.name = `${LANGUAGES[lang]}`;
   
    const headingTextNode = figma.createText();
    headingTextNode.name = `HEADING ${lang}`;
    headingTextNode.fontName = { family: "Roboto", style: "Bold" };
    headingTextNode.fontSize = 24;
    headingTextNode.characters = LANGUAGES[lang];
    headingTextNode.textAutoResize = "HEIGHT";
    headingTextNode.layoutAlign = 'STRETCH';


    langFrame.appendChild(headingTextNode);
    const codeTextNode = figma.createText();
    codeTextNode.name = `CODE ${lang}`;
    codeTextNode.fontName = { family: "Roboto Mono", style: "Regular" };
    codeTextNode.textAutoResize = "HEIGHT";
    langFrame.appendChild(codeTextNode);
    codeTextNode.resizeWithoutConstraints(700, 400);
    codeTextNode.layoutAlign = 'STRETCH';
    codeTextNode.textAutoResize = "HEIGHT";
    codeTextNode.characters = langJSONs[lang];
    // updateCodeHighlighter(codeTextNode, tokensObject[lang]);
    localeCodeFrame.appendChild(langFrame);
  });
  figma.notify("Code generated");
}
export default exportCode;