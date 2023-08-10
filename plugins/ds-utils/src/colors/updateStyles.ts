import createOrUpdateStyle from "./createOrUpdateStyle";
import parseTokens from "./parseTokens";
import globalColors from "../constant/tokens/globalColors";
import {
  figmaAliasLight,
  figmaAliasDark,
} from "../constant/tokens/aliasColors";

const updateStyles = () => {
  const paintStyles = figma.getLocalPaintStyles();
  // update global tokens
  let parsedGlobalTokens = parseTokens(globalColors);
  for (const name in parsedGlobalTokens) {
    const parts = name.split(".");
    const palette = parts.length > 1 ? `/${parts[0]}` : "";
    createOrUpdateStyle(
      paintStyles,
      `global${palette}`,
      name,
      parsedGlobalTokens[name]
    );
  }
  // update light alias tokens
  let parsedLightAliasTokens = parseTokens(figmaAliasLight);
  for (const name in parsedLightAliasTokens) {
    const type = name.split(".")[0] || "";
    createOrUpdateStyle(
      paintStyles,
      `light/${type}`,
      name,
      parsedLightAliasTokens[name]
    );
  }
  // update dark alias tokens
  let parsedDarkAliasTokens = parseTokens(figmaAliasDark);
  console.log(parsedDarkAliasTokens);
  for (const name in parsedDarkAliasTokens) {
    const type = name.split(".")[0] || "";
    createOrUpdateStyle(
      paintStyles,
      `dark/${type}`,
      name,
      parsedDarkAliasTokens[name]
    );
  }
};
export default updateStyles;
