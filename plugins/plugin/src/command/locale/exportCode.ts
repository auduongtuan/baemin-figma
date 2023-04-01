import { CODE_FRAME_NAME, LANGUAGES, PREFIX } from "../../constant/locale";
import { LocaleItem, isPlurals } from "../../lib/localeData";
import { js_beautify } from "js-beautify";
import { setNodeData, loadRobotoFontsAsync, getNodeData } from "figma-helpers";
import { set } from "lodash";
const firstPage = figma.root.children[0];
async function exportCode(localeItems: LocaleItem[]) {
  await loadRobotoFontsAsync();
  console.log('Testtt');
  let localeCodeFrame =
    (firstPage.findOne(
      (node) => getNodeData(node, `${PREFIX}code`) != ""
    ) as FrameNode) || null;
  if (!localeCodeFrame) {
    localeCodeFrame = figma.createFrame();
    setNodeData(localeCodeFrame, `${PREFIX}code`, "1");
    firstPage.appendChild(localeCodeFrame);
  }
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
    langFrame.resize(700, 800);
    langFrame.layoutGrow = 1;
    langFrame.layoutMode = 'VERTICAL';
    langFrame.counterAxisSizingMode = "AUTO";
    langFrame.itemSpacing = 16;
    langFrame.name = `${LANGUAGES[lang]}`;
    const langJSON = JSON.stringify(
      localeItems.reduce((acc, item) => {
        if(isPlurals(item[lang])) {
          Object.keys(item[lang]).forEach(quantity => {
            set(acc, `${item.key}_${quantity}`, item[lang][quantity]);
          });
        } else {
          set(acc, item.key, item[lang]);
        }
        return acc;
      }, {})
    );
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
    codeTextNode.characters = js_beautify(langJSON);
    localeCodeFrame.appendChild(langFrame);
  })

  figma.notify("Code generated");
}
export default exportCode;