import { webRGB, webRGBA, webRGBToFigmaRGB } from "figma-helpers/colors";
import globalColors from "../constant/tokens/globalColors";
import parseTokens, { convertTokens } from "./parseTokens";
import {
  figmaAliasDark,
  figmaAliasLight,
} from "../constant/tokens/aliasColors";
const localCollections = figma.variables.getLocalVariableCollections();
function getCollectionByName(name: string) {
  return localCollections.find((collection) => collection.name == name);
}
function getFigmaColor(color: webRGB | webRGBA) {
  let figmaColor: RGB | RGBA = null;
  if (color.length == 3) {
    figmaColor = webRGBToFigmaRGB(color as webRGB);
  }
  if (color.length == 4) {
    figmaColor = webRGBToFigmaRGB(color as webRGBA);
  }
  return figmaColor;
}

function createOrGetVariable(
  collection: VariableCollection,
  variableName: string,
  variableDataType: VariableResolvedDataType
) {
  try {
    const variable = figma.variables.createVariable(
      variableName,
      collection.id,
      variableDataType
    );
    return variable;
  } catch {
    const variables = collection.variableIds.map((variable) =>
      figma.variables.getVariableById(variable)
    );
    return variables.find((variable) => variable.name == variableName);
  }
}

function getVariable(collection: VariableCollection, variableName: string) {
  const variables = collection.variableIds.map((variable) =>
    figma.variables.getVariableById(variable)
  );
  return variables.find((variable) => variable.name == variableName);
}
function createGlobalColorVariables() {
  const globalColorsCollection = getCollectionByName("Global Colors");
  if (!globalColorsCollection) return;
  let parsedGlobalTokens = parseTokens(globalColors);

  for (const name in parsedGlobalTokens) {
    const parts = name.split(".");
    const palette = parts.length > 1 ? `/${parts[0]}` : "";
    // createOrUpdateStyle(
    //   paintStyles,
    //   `global${palette}`,
    //   name,
    //   parsedGlobalTokens[name]
    // );
    const colorVariable = createOrGetVariable(
      globalColorsCollection,
      `global${palette}/${name.replace(/\./g, "-")}`,
      "COLOR"
    );
    console.log(colorVariable);
    let figmaColor = getFigmaColor(parsedGlobalTokens[name]);
    colorVariable.setValueForMode(
      globalColorsCollection.defaultModeId,
      figmaColor
    );
  }

  console.log(globalColorsCollection);
}
function createAliasColorVariables() {
  const globalColorsCollection = getCollectionByName("Global Colors");
  const aliasColorsCollection = getCollectionByName("Alias Colors");
  if (!aliasColorsCollection) return;
  aliasColorsCollection.renameMode(
    aliasColorsCollection.defaultModeId,
    "light"
  );
  if (aliasColorsCollection.modes.length < 2) {
    aliasColorsCollection.addMode("dark");
  }
  const lightMode = aliasColorsCollection.modes.find(
    (mode) => mode.name == "light"
  );
  const darkMode = aliasColorsCollection.modes.find(
    (mode) => mode.name == "dark"
  );
  let parsedLightTokens = parseTokens(figmaAliasLight);
  let parsedDarkTokens = parseTokens(figmaAliasDark);
  const lightModeAlias = convertTokens(figmaAliasLight);
  const darkModeAlias = convertTokens(figmaAliasDark);
  console.log(lightModeAlias);
  for (const name in parsedLightTokens) {
    const parts = name.split(".");
    const palette = parts.length > 1 ? `${parts[0]}` : "";
    // createOrUpdateStyle(
    //   paintStyles,
    //   `global${palette}`,
    //   name,
    //   parsedGlobalTokens[name]
    // );
    const colorVariable = createOrGetVariable(
      aliasColorsCollection,
      `${palette}/${name.replace(/\./g, "-")}`,
      "COLOR"
    );
    if (colorVariable) {
      // try to set alias
      const lightAliasVariable = getVariable(
        globalColorsCollection,
        lightModeAlias[name]?.replace(/\./g, "-")
      );
      const darkAliasVariable = getVariable(
        globalColorsCollection,
        darkModeAlias[name]?.replace(/\./g, "-")
      );
      if (lightAliasVariable && darkAliasVariable) {
        const lightAliasValue =
          figma.variables.createVariableAlias(lightAliasVariable);
        colorVariable.setValueForMode(lightMode.modeId, lightAliasValue);
        const darkAliasValue =
          figma.variables.createVariableAlias(darkAliasVariable);
        colorVariable.setValueForMode(darkMode.modeId, darkAliasValue);
      } else {
        const figmaColor = getFigmaColor(parsedLightTokens[name]);
        const darkFigmaColor =
          name in parsedDarkTokens
            ? getFigmaColor(parsedDarkTokens[name])
            : null;
        colorVariable.setValueForMode(lightMode.modeId, figmaColor);
        if (darkFigmaColor) {
          colorVariable.setValueForMode(darkMode.modeId, darkFigmaColor);
        }
      }
    } else {
      console.log("Cannot create or find variable " + name);
    }
  }
}
function assignVariablesToColorStyles() {
  const paintStyles = figma.getLocalPaintStyles();
  const globalColorsCollection = getCollectionByName("Global Colors");
  const aliasColorsCollection = getCollectionByName("Alias Colors");
  for (const paintStyle of paintStyles) {
    let variable: Variable = null;
    let variableName = "";
    if (paintStyle.name.startsWith("global/")) {
      variableName = paintStyle.name
        .replace(/global\/[a-z]+\//, "")
        .replace(/\./g, "-");
      variable = getVariable(globalColorsCollection, variableName);
    }
    if (
      paintStyle.name.startsWith("light/") ||
      paintStyle.name.startsWith("dark/")
    ) {
      variableName = paintStyle.name
        .replace(/(light|dark)\//, "")
        .replace(/\./g, "-");
      variable = getVariable(aliasColorsCollection, variableName);
    }
    const paintsCopy = [...paintStyle.paints];
    if (variable && paintsCopy[0].type == "SOLID") {
      paintsCopy[0] = figma.variables.setBoundVariableForPaint(
        paintsCopy[0],
        "color",
        variable
      );
      paintStyle.paints = paintsCopy;
    }
    console.log("done " + paintStyle.name);
  }
}
const createVariables = () => {
  createGlobalColorVariables();
  createAliasColorVariables();
  assignVariablesToColorStyles();
};
export default createVariables;
