import { getNodeData, setNodeData } from "figma-helpers";
import { hexToFigmaRGB } from "figma-helpers/colors";
import {
  LocaleJsonFormat,
  LocaleLibrary,
  defaultDateTimeFormat,
} from "../../lib";
import {
  CODE_FRAME_NAME,
  CODE_INFO_FRAME_NAME,
  LANGUAGE_LIST,
  PREFIX,
} from "../../lib/constant";
import configs from "figma-helpers/configs";
const firstPage = figma.root.children[0];
// async function exportCode(tokensObject: {[key:string]: Array<string | Token>}) {
async function printCodeBlock(
  library: LocaleLibrary,
  langJSONs: { [key: string]: string },
  format: LocaleJsonFormat,
  scope: "page" | "file" = "file"
) {
  const scopeFind = scope == "file" ? firstPage : figma.currentPage;
  let localeCodeBlock =
    (scopeFind.findOne(
      (node) =>
        getNodeData(node, `${PREFIX}code`) == "1" &&
        getNodeData(node, `${PREFIX}library_id`) == library.id
    ) as FrameNode) || null;
  if (!localeCodeBlock) {
    localeCodeBlock = figma.createFrame();
  }
  setNodeData(localeCodeBlock, `${PREFIX}code`, "1");
  setNodeData(localeCodeBlock, `${PREFIX}library_id`, library.id);
  scopeFind.appendChild(localeCodeBlock);
  // }
  const paint: SolidPaint = {
    type: "SOLID",
    color: hexToFigmaRGB("#FFF"),
  };
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
  localeCodeBlock.bottomLeftRadius = 8;
  localeCodeBlock.bottomRightRadius = 8;
  localeCodeBlock.topLeftRadius = 8;
  localeCodeBlock.topRightRadius = 8;
  localeCodeBlock.children.forEach((child) => {
    child.remove();
  });

  const namespaceFrame = figma.createFrame();
  namespaceFrame.name = CODE_INFO_FRAME_NAME;
  namespaceFrame.layoutMode = "VERTICAL";
  namespaceFrame.primaryAxisSizingMode = "AUTO";
  namespaceFrame.counterAxisSizingMode = "AUTO";
  namespaceFrame.itemSpacing = 8;
  namespaceFrame.layoutAlign = "STRETCH";
  const namespaceTextNode = figma.createText();
  namespaceTextNode.name = `${library.name}`;
  namespaceTextNode.fontName = { family: "Roboto", style: "Bold" };
  namespaceTextNode.fontSize = 24;
  namespaceTextNode.characters = library.name;
  // namespaceTextNode.textAutoResize = "HEIGHT";
  // namespaceTextNode.layoutAlign = "STRETCH";
  const namespaceInfoTextNode = figma.createText();
  namespaceInfoTextNode.name = `${library.name}`;
  namespaceInfoTextNode.fontName = { family: "Roboto", style: "Regular" };
  namespaceInfoTextNode.fontSize = 10;
  namespaceInfoTextNode.opacity = 0.6;
  namespaceInfoTextNode.characters = `FORMAT: ${format}  —  EXPORT AT: ${defaultDateTimeFormat()} — BY: ${
    figma.currentUser.name
  }`;
  // namespaceInfoTextNode.textAutoResize = "HEIGHT";
  // namespaceInfoTextNode.layoutAlign = "STRETCH";
  namespaceFrame.appendChild(namespaceTextNode);
  namespaceFrame.appendChild(namespaceInfoTextNode);
  localeCodeBlock.appendChild(namespaceFrame);

  const localeCodes = figma.createFrame();
  localeCodes.fills = [paint];
  localeCodes.resize(1400, 800);
  localeCodes.layoutMode = "HORIZONTAL";
  localeCodes.counterAxisSizingMode = "AUTO";
  localeCodes.itemSpacing = 36;
  localeCodes.name = CODE_FRAME_NAME;

  localeCodeBlock.appendChild(localeCodes);
  const languages = configs.get("languages");
  languages.forEach((lang) => {
    const langFrame = figma.createFrame();
    langFrame.fills = [paint];
    langFrame.resize(700, 800);
    langFrame.layoutGrow = 1;
    langFrame.layoutMode = "VERTICAL";
    langFrame.counterAxisSizingMode = "FIXED";
    langFrame.itemSpacing = 16;
    langFrame.name = `${LANGUAGE_LIST[lang]}`;

    const headingTextNode = figma.createText();
    headingTextNode.name = `HEADING ${lang}`;
    headingTextNode.fontName = { family: "Roboto", style: "Bold" };
    headingTextNode.fontSize = 16;
    headingTextNode.characters = LANGUAGE_LIST[lang];
    // headingTextNode.textAutoResize = "HEIGHT";
    // headingTextNode.layoutAlign = "STRETCH";

    langFrame.appendChild(headingTextNode);
    const codeTextNode = figma.createText();
    codeTextNode.name = `CODE ${lang}`;
    codeTextNode.fontName = { family: "Roboto Mono", style: "Regular" };
    codeTextNode.fontSize = 12;
    codeTextNode.lineHeight = {
      value: 14,
      unit: "PIXELS",
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
  namespaceInfoTextNode.layoutAlign = "STRETCH";
  namespaceTextNode.layoutAlign = "STRETCH";
  figma.notify("Code generated");
}
export default printCodeBlock;
