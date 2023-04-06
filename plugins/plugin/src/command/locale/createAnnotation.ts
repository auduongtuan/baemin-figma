import * as h from "figma-helpers";
import { MIXED_VALUE } from "../../constant/locale";
import { LocaleText } from "../../lib/localeData";
import { getLang, getKey, getVariables } from "./common";
import { loadRobotoFontsAsync, isFrame, ContainerNode } from "figma-helpers";
import { truncate } from "lodash";
import { hexToFigmaRGB } from "figma-helpers/colors";
type Annotation = LocaleText & { node: TextNode };
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
    console.log(allTextNodes);
    const paint: SolidPaint = {
      type: "SOLID",
      color: hexToFigmaRGB("#A966FF"),
    };
    // title.characters = "i18n";
    // title.visible = false;
    const annotateTextData: Annotation[] = texts
      .filter((text) => text.key)
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
      a: Annotation,
      b: Annotation
    ) {
      return sortByAbsolutePosition(a.node, b.node);
    }
    const containerX = textContainer.absoluteTransform[0][2];
    const containerY = textContainer.absoluteTransform[1][2];
    console.log({ containerX, containerY });
    const annotateX = containerX - 240 - 24;
    let currentY = 0;
    const groupNodes = [];
    annotateTextData
      .sort(sortAnnotationByTextAbsolutePosition)
      .forEach((annotation) => {
        if (!annotation.node) return;
        // id: textNode.id,
        const annotateTextNode = figma.createText();
        annotateTextNode.fills = [paint];
        annotateTextNode.fontName = { family: "Roboto Mono", style: "Regular" };
        annotateTextNode.textAutoResize = "HEIGHT";
        annotateTextNode.fontSize = 12;
        annotateTextNode.resizeWithoutConstraints(240, 16);
        annotateTextNode.textAlignHorizontal = "RIGHT";
        annotateTextNode.characters = annotation.key;
        annotateTextNode.x = annotateX;
        const annotateLine = figma.createVector();
        annotateLine.strokeWeight = 1;
        annotateLine.strokes = [paint];
        const textX = annotation.node.absoluteTransform[0][2];
        const textY = annotation.node.absoluteTransform[1][2];
        const calY =
          textY + (annotation.node.height - annotateTextNode.height) / 2;
        if (calY > currentY - 16 && calY < currentY + 16) {
          annotateTextNode.y = calY + annotation.node.height / 2 + 16;
          const textCenterX = textX + 4;
          const bottomTextY = textY + annotation.node.height + 2;
          annotateLine.vectorPaths = [
            {
              windingRule: "NONE",
              data: `M ${containerX - 16} ${
                annotateTextNode.y + 8
              } L ${textCenterX} ${
                annotateTextNode.y + 8
              } L ${textCenterX} ${bottomTextY}`,
            },
          ];
        } else {
          annotateTextNode.y = calY;
          annotateLine.vectorPaths = [
            {
              windingRule: "NONE",
              data: `M ${containerX - 16} ${calY + 8} L ${textX - 6} ${
                calY + 8
              }`,
            },
          ];
        }
        currentY = annotateTextNode.y;
        groupNodes.push(annotateTextNode, annotateLine);
        // figma.currentPage.appendChild(annotateTextNode);
      });
    const group = figma.group(groupNodes, figma.currentPage);
    group.name = `${textContainer.name} - i18n annotation`;
  });
}

export default createAnnotation;
