import {
  hexToWebRgbString,
  figmaRGBToHex,
  figmaRGBToWebRGB,
  hexToFigmaRGB,
  hexToWebRgb,
  webRGBToFigmaRGB,
  webRGBToString,
  webRGB,
  webRGBA,
  webStringToWebRgb,
} from "../lib/colors";
import {
  selection,
  isFrame,
  isText,
  isInstance,
  isComponent,
} from "./commandHelper";
import { figmaAliasLight } from "../constant/tokens/aliasColors";
import globalColors from "../constant/tokens/globalColors";
import { groupBy, isEqual, isObject, isString } from "lodash";

const ds: { [key: string]: Function } = {};

ds.test = () => {

  const container = selection(0) as FrameNode;
  const palettes = container.findChildren(
    (node) => isFrame(node) && /[A-Za-z]+/.test(node.name)
  );
  palettes.forEach((palette: FrameNode) => {
    // palette.name = palette.name.toLowerCase();
    const colors = palette.children;
    colors.forEach((color: FrameNode) => {
      // const colorNames = color.name.match(/([A-Za-z]+)(\d+)/);
      // console.log(colorNames);
      // if(colorNames) {
      // color.name = colorNames[1].toLowerCase() + '.' + colorNames[2];
      // }

      const name = color.children[0] as TextNode;
      const value = color.children[1] as TextNode;
      name.characters = color.name;
      const colorRGB = (color.fills[0] as SolidPaint).color;
      if (colorRGB) {
        value.characters = figmaRGBToHex(colorRGB).toUpperCase();
      }
      // name.name = 'Name';
      // value.name = 'Value';
    });
  });
  console.log(palettes);
};
function createOrUpdateToken(
  paintStyles: PaintStyle[],
  prefix,
  name: string,
  value: webRGB | webRGBA
) {
  let alpha: number = 1;
  if (value[3]) {
    alpha = value[3];
    value.splice(0, -1);
  }
  let figmaRgb = webRGBToFigmaRGB(value as webRGB);
  if ("a" in figmaRgb) delete figmaRgb.a;
  if ("r" in figmaRgb && "g" in figmaRgb && "b" in figmaRgb) {
    const paint: SolidPaint = {
      type: "SOLID",
      color: figmaRgb,
      opacity: alpha,
    };
    // console.log(name, figmaRgb, alpha);
    const paintStyleFound = paintStyles.find(
      (paintStyle) => paintStyle.name == prefix + "/" + name
    );
    // const paintStyle = paintStyleFound || figma.createPaintStyle();
    if(!paintStyleFound) {
      figma.notify(`Cannot found ${name} style`);
      return;
    }
    const paintStyle = paintStyleFound;
    paintStyle.name = prefix + "/" + name;
    const parts = name.split(".");
    const type = parts[0];
    const labels = {
      fg: "texts and icons",
      border: "border",
      bg: "background",
    };
    let role = parts[1];
    const roleAlt = {
      "error": ["negative"],
      "success": ["positive"],
      "primary": ["brand"],
      "warning": ["attentive"],
      "new": ["updated"],
      "subtle": ["weak"]
      // "weakest": ["placeholder"]
    }
    if(role in roleAlt) {
      role = [role, ...roleAlt[role]].join(', ')
      if(role == 'onColor') {
        role = 'on-color-background'
      }
    }
    const suffixs = {
      "bg.emphasis": " like tooltips",
      "bg.backdrop": " like dialog backdrop",
      "bg.overlay": " like image/video overlay",
      "fg.strong": ", and headings",
      "fg.secondary": " like help texts, subtexts, subheadings, and subtitles",
      "fg.tertiary": " like labels, and control icons",
      "fg.subtle": " like placeholder texts",
      "border.action": " like inputs or buttons",
      "border.modal": " like popups (popover), dialogs, dropdown menus",
      "border.default": " like containers/boxes",
    };
    function getSuffix(name: string): string {
      if(name in suffixs) {
        return suffixs[name];
      } else {
        for(const key in suffixs) {
          if(key.includes(name)) {
            return suffixs[key];
          }
        }
      }
      return '';
    }
    const interaction = parts.slice(-1)[0];
    const states = {
      'default': ' in rest state',
      'hover': ' in hover state',
      'disabled':  ' in disabled state',
      'pressed': ' in pressed, active state',
    }
    console.log(name, type, parts, labels[type], suffixs[name]);
    if (role && (type == "fg" || type == "bg" || type == "border")) {
      let description =
        ["Used for", role, labels[type]].join(" ") +
        getSuffix(name) +
        (interaction in states && parts.length > 2 ? states[interaction] : '') +
        ".";
      if(paintStyle.description != description) paintStyle.description = description;
    } else {
      // console.log(name, type, parts);
    }
    // update exists
    if (paintStyleFound) {
      if (!isEqual(paintStyle.paints, [paint])) {
        // console.log("Update ", paintStyle.name);
        paintStyle.paints = [paint];
      }
    }
    // create new
    else {
      // console.log("Create ", paintStyle.name);
      paintStyle.paints = [paint];
    }
  } else {
    // console.log("Loi ", name, value, figmaRgb);
  }
}
ds.addDescription = () => {};
ds.copyAttributesToChild = () => {
  selection().forEach((node) => {
    if (isFrame(node) || isInstance(node) || isComponent(node)) {
      const child = node.children[0];
      let {
        layoutMode,
        primaryAxisSizingMode,
        counterAxisSizingMode,
        primaryAxisAlignItems,
        counterAxisAlignItems,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
        itemSpacing,
        clipsContent,
        fillStyleId,
        strokeStyleId,
        strokeWeight,
        strokeJoin,
        strokeAlign,
        cornerRadius,
      } = node;
      let oldAttributes = {
        layoutMode,
        primaryAxisSizingMode,
        counterAxisSizingMode,
        primaryAxisAlignItems,
        counterAxisAlignItems,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
        itemSpacing,
        clipsContent,
        fillStyleId,
        strokeStyleId,
        strokeWeight,
        strokeJoin,
        strokeAlign,
        cornerRadius,
      };
      let width = node.width;
      let height = node.height;
      if (isFrame(child) || isInstance(child)) {
        for (const key in oldAttributes) {
          child[key] = oldAttributes[key];
        }
        child.resize(width, height);
      }
    }
  });
};
ds.updateTokens = () => {
  const paintStyles = figma.getLocalPaintStyles();
  // update global tokens
  let parsedGlobalTokens = parseTokens(globalColors);
  for (const name in parsedGlobalTokens) {
    const parts = name.split(".");
    const palette = parts.length > 1 ? `/${parts[0]}` : "";
    createOrUpdateToken(
      paintStyles,
      `global${palette}`,
      name,
      parsedGlobalTokens[name]
    );
  }
  // update alias tokens
  let parsedAliasTokens = parseTokens(figmaAliasLight);
  for (const name in parsedAliasTokens) {
    const type = name.split(".")[0] || "";
    createOrUpdateToken(
      paintStyles,
      `light/${type}`,
      name,
      parsedAliasTokens[name]
    );
  }
};
const convertToken = (tokens) => {
  let res = {};
  const recurse = (obj, current) => {
    for (const key in obj) {
      let value = obj[key];
      let newKey = current ? current + "." + key : key;
      if (value && typeof value === "object") {
        recurse(value, newKey);
      } else {
        res[newKey] = value;
      }
    }
  };
  recurse(tokens, "");
  return res;
};
function parseTokens(aliasList) {
  let convertedTokens = convertToken(aliasList);
  let parsedTokens: { [key: string]: webRGB | webRGBA } = {};
  // check converted
  let full = true;
  const re = new RegExp(/([A-Za-z]+)(?:\.(\d+))?(?:\/(\d+\.\d+))?/);
  for (const tokenName in convertedTokens) {
    let currentValue = convertedTokens[tokenName] as string;
    if (currentValue.startsWith("rgb") || currentValue.startsWith("#")) {
      parsedTokens[tokenName] = webStringToWebRgb(currentValue);
    } else {
      let parsedColor = re.exec(currentValue);
      if (parsedColor) {
        const [orginal, color, level, opacity] = parsedColor;
        let colorValue;
        if (level) {
          if (
            color in globalColors &&
            typeof globalColors[color] == "object" &&
            level in globalColors[color]
          ) {
            colorValue = globalColors[color][level];
          }
        } else if (typeof globalColors[color] != "object") {
          colorValue = globalColors[color];
        }
        if (opacity) {
          parsedTokens[tokenName] = hexToWebRgb(
            colorValue,
            parseFloat(opacity)
          );
        } else {
          parsedTokens[tokenName] = hexToWebRgb(colorValue);
        }
      }
    }
  }
  return parsedTokens;
}
ds.displayTokens = async () => {
  await figma.loadFontAsync({ family: "Roboto Mono", style: "Regular" });
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
  await figma.loadFontAsync({ family: "Roboto Mono", style: "SemiBold" });
  await (async () => {
    let convertedTokens = convertToken(figmaAliasLight);
    const MAX_ITEMS_PER_LINE = 5;
    const X_SPACING = 16;
    const Y_SPACING = 32;
    const paintStyles = figma
      .getLocalPaintStyles()
      .filter((paintStyle) => paintStyle.name.startsWith("light/"));
    const TokenItem = figma.currentPage.findOne(
      (node) => node.type == "COMPONENT" && node.name == "Token Item"
    ) as ComponentNode;
    const TokenContainer = figma.currentPage.findOne(
      (node) => isFrame(node) && node.name == "TOKEN DISPLAY CONTAINER"
    ) as FrameNode;
    function getTokenName(paintStyle: PaintStyle) {
      const parts = paintStyle.name.split("/") as string[];
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

// check cover

// tokenNameList.forEach((tokenName) => {
//   if (!(tokenName in convertedTokens)) {
//     full = false;
//     console.log("Dont have " + tokenName);
//   } else {
//     // console.log('Has '+tokenName);
//   }
// });
// console.log(full);

export default ds;
