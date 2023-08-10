import { figmaRGBToHex } from "figma-helpers/colors";
import { selection, isFrame } from "figma-helpers";
import {
  darkAliasReferences,
  lightAliasReferences,
} from "./constant/tokens/aliasColors";
import displayTokenList from "./colors/displayTokenList";
import copyAttributesToChild from "./shortcuts/copyAttributesToChild";
import updateStyles from "./colors/updateStyles";
import createVariables from "./colors/createVariables";
const designSystem: { [key: string]: Function } = {};
designSystem.variableTest = () => {
  createVariables();
};
designSystem.test = () => {
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

designSystem.addDescription = () => {};
designSystem.copyAttributesToChild = copyAttributesToChild;
designSystem.updateTokens = updateStyles;
designSystem.displayTokens = async () => {
  await displayTokenList(
    "light",
    lightAliasReferences,
    "TOKEN DISPLAY CONTAINER - LIGHT"
  );
  await displayTokenList(
    "dark",
    darkAliasReferences,
    "TOKEN DISPLAY CONTAINER - DARK"
  );
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

export default designSystem;
