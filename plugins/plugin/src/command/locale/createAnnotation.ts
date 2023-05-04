import * as h from "figma-helpers";
import { MIXED_VALUE } from "../../constant/locale";
import { LocaleText } from "../../lib/localeData";
import { getLang, getKey, getVariables } from "./common";
import { loadRobotoFontsAsync, isFrame, ContainerNode } from "figma-helpers";
import { truncate } from "lodash";
import { hexToFigmaRGB } from "figma-helpers/colors";
type AnnotatedText = LocaleText & { node: TextNode };
function sortByAbsolutePosition(a: SceneNode, b: SceneNode) {
  return (
    a.absoluteTransform[1][2] - b.absoluteTransform[1][2] ||
    a.absoluteTransform[0][2] - b.absoluteTransform[0][2]
  );
}
async function createAnnotation(texts: LocaleText[]) {
  const selection = h.selection();
  await loadRobotoFontsAsync("Mono", "Regular");
  figma.skipInvisibleInstanceChildren = true;
  selection.forEach((selectionItem) => {
    const allTextNodes: TextNode[] = [];
    let textContainer: ContainerNode;
    if (h.isText(selectionItem)) {
      allTextNodes.push(selectionItem);
      if (isFrame(selectionItem.parent)) textContainer = selectionItem.parent;
    } else if (h.isContainer(selectionItem)) {
      allTextNodes.push(
        ...(selectionItem.findAllWithCriteria({
          types: ["TEXT"],
        }) as TextNode[])
      );
      textContainer = selectionItem;
    }
    if (!textContainer) return;
    // console.log(allTextNodes);
    const paint: SolidPaint = {
      type: "SOLID",
      color: hexToFigmaRGB("#A966FF"),
    };
    // title.characters = "i18n";
    // title.visible = false;
    const annotatedTextData: AnnotatedText[] = texts
      .filter((text) => text.formula || text.key)
      .reduce((acc, text) => {
        const node = allTextNodes.find((node) => node.id == text.id);
        if (node) {
          acc.push({
            ...text,
            node: allTextNodes.find((node) => node.id == text.id),
          });
        }
        return acc;
      }, []);
    function sortAnnotationByTextAbsolutePosition(
      a: AnnotatedText,
      b: AnnotatedText
    ) {
      return sortByAbsolutePosition(a.node, b.node);
    }
    const keyTextNodeSize = 320;
    const containerX = textContainer.absoluteTransform[0][2];
    const containerY = textContainer.absoluteTransform[1][2];
    const annotateX = containerX - keyTextNodeSize - 24;
    let currentY = 0;
    const groupNodes = [];
    annotatedTextData
      .sort(sortAnnotationByTextAbsolutePosition)
      .forEach((annotatedText) => {
        if (!annotatedText.node) return;
        // id: textNode.id,
        const keyTextNode = figma.createText();
        keyTextNode.fills = [paint];
        keyTextNode.fontName = { family: "Roboto Mono", style: "Regular" };
        keyTextNode.textAutoResize = "HEIGHT";
        keyTextNode.fontSize = 12;
        keyTextNode.resizeWithoutConstraints(keyTextNodeSize, 16);
        keyTextNode.textAlignHorizontal = "RIGHT";
        keyTextNode.characters = annotatedText.formula || annotatedText.key;
        keyTextNode.x = annotateX;
        const annotateLine = figma.createVector();
        annotateLine.strokeWeight = 1;
        annotateLine.strokes = [paint];
        const textX = annotatedText.node.absoluteTransform[0][2];
        const textY = annotatedText.node.absoluteTransform[1][2];
        const textWidth = annotatedText.node.width;
        const textHeight = annotatedText.node.height;
        const textHorizontalAlign = annotatedText.node.textAlignHorizontal;
        const centerOfTextY =
          textY + (textHeight - keyTextNode.height) / 2;
        // cung X = ve duong cong
        if (centerOfTextY > currentY - 16 && centerOfTextY < currentY + 16) {
          keyTextNode.y = centerOfTextY + textHeight / 2 + 16;
          const lineEndXCases = {
            'LEFT': textX + 4,
            'CENTER': textX + textWidth/2,
            'RIGHT': textX + textWidth - 4
          }
          const lineEndX: number = lineEndXCases[textHorizontalAlign];
          const bottomTextY = textY + textHeight + 2;
          annotateLine.vectorPaths = [
            {
              windingRule: "NONE",
              data: `M ${containerX - 16} ${
                keyTextNode.y + 8
              } L ${lineEndX} ${
                keyTextNode.y + 8
              } L ${lineEndX} ${bottomTextY}`,
            },
          ];
        } else {
          keyTextNode.y = centerOfTextY;
          annotateLine.vectorPaths = [
            {
              windingRule: "NONE",
              data: `M ${containerX - 16} ${centerOfTextY + 8} L ${textX - 6} ${
                centerOfTextY + 8
              }`,
            },
          ];
        }
        currentY = keyTextNode.y;
        groupNodes.push(keyTextNode, annotateLine);
        // figma.currentPage.appendChild(annotateTextNode);
      });
    const group = figma.group(groupNodes, figma.currentPage);
    group.name = `${textContainer.name} - i18n annotation`;
  });
}

export default createAnnotation;
