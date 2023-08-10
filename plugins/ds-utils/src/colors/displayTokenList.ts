import { convertTokens } from "./parseTokens";
import { isFrame, isText } from "figma-helpers";
import { figmaRGBToWebRGB, figmaRGBToHex } from "figma-helpers/colors";
import { groupBy } from "lodash-es";
const displayTokenList = async (
  prefix = "light",
  aliasTokens,
  containerName
) => {
  await figma.loadFontAsync({ family: "Roboto Mono", style: "Regular" });
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
  await figma.loadFontAsync({ family: "Roboto Mono", style: "SemiBold" });
  await (async () => {
    let convertedTokens = convertTokens(aliasTokens);
    const MAX_ITEMS_PER_LINE = 5;
    const X_SPACING = 16;
    const Y_SPACING = 32;
    const paintStyles = figma
      .getLocalPaintStyles()
      .filter((paintStyle) => paintStyle.name.startsWith(`${prefix}/`));
    const TokenItem = figma.currentPage.findOne(
      (node) => node.type == "COMPONENT" && node.name == "Token Item"
    ) as ComponentNode;
    const TokenContainer = figma.currentPage.findOne(
      (node) => isFrame(node) && node.name == containerName
    ) as FrameNode;
    function getTokenName(paintStyle: PaintStyle) {
      const parts = paintStyle.name.split("/") as string[];
      if (!parts) console.log(paintStyle.name);
      return parts.slice(-1)[0];
    }
    function createTokenItem(paintStyle): InstanceNode {
      const tokenInstance = TokenItem.createInstance();
      const tokenName = getTokenName(paintStyle);
      const nameNode = tokenInstance.findOne(
        (node) => isText(node) && node.name == "Name"
      ) as TextNode;
      const aliasNode = tokenInstance.findOne(
        (node) => isText(node) && node.name == "Alias"
      ) as TextNode;
      const descriptionNode = tokenInstance.findOne(
        (node) => isText(node) && node.name == "Description"
      ) as TextNode;
      const valueNode = tokenInstance.findOne(
        (node) => isText(node) && node.name == "Value"
      ) as TextNode;
      const colorNode = tokenInstance.findOne(
        (node) => isFrame(node) && node.name == "Color"
      ) as FrameNode;
      if (paintStyle.paints[0].type == "SOLID") {
        aliasNode.characters = convertedTokens[tokenName] || "-";
        if (paintStyle.paints[0].opacity == 1) {
          valueNode.characters = figmaRGBToHex(paintStyle.paints[0].color);
        } else {
          let paintRGBA = figmaRGBToWebRGB(
            paintStyle.paints[0].color
          ) as number[];
          paintRGBA.push(
            Math.round((paintStyle.paints[0].opacity as number) * 100) / 100
          );
          valueNode.characters = `rgba(${paintRGBA.join(", ")})`;
        }
      }
      nameNode.characters = tokenName;
      descriptionNode.characters = paintStyle.description;
      colorNode.fillStyleId = paintStyle.id;
      return tokenInstance;
    }
    const groupedByTypePaintStyles = groupBy(
      paintStyles,
      (paintStyle) => paintStyle.name.split("/")[1]
    );
    console.log(groupedByTypePaintStyles);
    TokenContainer.children.forEach((node) => node.remove());
    for (const type in groupedByTypePaintStyles) {
      const frame = figma.createFrame();
      frame.name = type;
      let nextY = 0;

      // 3 line vars - need to reset
      let nextX = 0;
      let currentItems = 0;
      let maxHeightOfThisLine = 0;
      let previousRole: string;
      let currentMaxItemsPerLine = 0;
      groupedByTypePaintStyles[type].forEach((paintStyle) => {
        const tokenItem = createTokenItem(paintStyle);
        frame.appendChild(tokenItem);

        const tokenNameParts = getTokenName(paintStyle).split(".");
        // break line
        if (
          (previousRole != tokenNameParts[1] && tokenNameParts.length >= 3) ||
          currentItems + 1 > MAX_ITEMS_PER_LINE
        ) {
          tokenItem.x = 0;
          tokenItem.y = nextY + maxHeightOfThisLine + Y_SPACING;
          nextY = tokenItem.y;
          nextX = tokenItem.width + X_SPACING;
          currentItems = 1;
          maxHeightOfThisLine = tokenItem.height;
        } else {
          tokenItem.x = nextX;
          tokenItem.y = nextY;
          nextX += tokenItem.width + X_SPACING;
          currentItems++;
          if (tokenItem.height > maxHeightOfThisLine)
            maxHeightOfThisLine = tokenItem.height;
        }
        if (currentItems > currentMaxItemsPerLine)
          currentMaxItemsPerLine = currentItems;
        previousRole = tokenNameParts[1];
      });
      let totalWidth =
        currentMaxItemsPerLine * (TokenItem.width + X_SPACING) - X_SPACING;
      frame.resizeWithoutConstraints(totalWidth, nextY + maxHeightOfThisLine);
      TokenContainer.appendChild(frame);
    }
  })();
};

export default displayTokenList;
