import {
  hexToWebRgb,
  webRGB,
  webRGBA,
  webStringToWebRgb,
} from "figma-helpers/colors";
import globalColors from "../constant/tokens/globalColors";

export const convertTokens = (tokens) => {
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
  let convertedTokens = convertTokens(aliasList);
  let parsedTokens: { [key: string]: webRGB | webRGBA } = {};
  // check converted
  let full = true;
  const re = new RegExp(/([A-Za-z]+)(?:\.(\d+))?(?:\/(\d+\.\d+))?/);
  for (const tokenName in convertedTokens) {
    let currentValue = convertedTokens[tokenName] as string;
    // special treatment for transparent
    if (currentValue == "transparent") {
      currentValue = "white/0.001";
    }
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

export default parseTokens;
