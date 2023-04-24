import { isContainer, isText, selection } from "figma-helpers";
import { placeholders } from "../../lib/helpers";
import { DEFAULT_LANG } from "../../constant/locale";
import {
  Lang,
  LocaleItem,
  LocaleText,
  LocaleTextProps,
  LocaleTextVariables,
  findItemByKey,
  isPlurals,
  getTextCharacters,
} from "../../lib/localeData";
import {
  setKey,
  setFormula,
  setLang,
  getLang,
  getKey,
  setVariables,
  getVariables,
  setVariable,
} from "./common";
import { isString } from "lodash";
import { matchAll } from "../../lib/helpers";

// find text node
export function updateTextNode(textNode: TextNode, textProps: LocaleTextProps) {
  console.log("UPDATE TEXT NODE");
  if (!textProps) return;
  console.log("TEXT PROPS", textProps);

  if (textProps.key && !textProps.item && !textProps.item.key) {
    setKey(textNode, textProps.key);
  }
  if (textProps.key === "") setKey(textNode, textProps.key);
  const oldLang = getLang(textNode) || DEFAULT_LANG;
  const newLang = textProps.lang || DEFAULT_LANG;
  setLang(textNode, newLang);

  if (typeof textProps.formula != "undefined") {
    setFormula(textNode, textProps.formula || "");
  }

  if (textProps.variables) setVariables(textNode, textProps.variables);
  // update text content
  if (textProps.item && !textProps.formula) {
    const currentLang = getLang(textNode) || DEFAULT_LANG;
    const localeItemContent = textProps.item[currentLang];
    const variables = getVariables(textNode);
    if (isPlurals(localeItemContent) && !variables.count) {
      setVariable(textNode, "count", 1);
      variables.count = 1;
    }
    setKey(textNode, textProps.item.key);
    // NON PLURAL
    textNode.characters = getTextCharacters(localeItemContent, variables);
  }
  console.log("mark---");
  if (textProps.formula && textProps.items) {
    console.log("mark2---");
    console.log({ formula: textProps.formula, items: textProps.items });
    const localeItems = textProps.items;
    let newString = textProps.formula;
    const variables = getVariables(textNode);
    const matches = matchAll(/\:\s*([A-Za-z0-9\._]+)\s*\:/, textProps.formula);
    const oldCharacters = textNode.characters;
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const fields = [
      "fontSize",
      "fontName",
      // "fontWeight",
      "textDecoration",
      "textCase",
      "lineHeight",
      "letterSpacing",
      "fills",
      "textStyleId",
      "fillStyleId",
      "hyperlink",
      "listOptions",
    ];
    const styleSegments = textNode.getStyledTextSegments([
      "fontSize",
      "fontName",
      // "fontWeight",
      "textDecoration",
      "textCase",
      "lineHeight",
      "letterSpacing",
      "fills",
      "textStyleId",
      "fillStyleId",
      "hyperlink",
      "listOptions",
    ]);
    const keySegments = [];
    if (matches) {
      matches.forEach((match: string[]) => {
        if (match.length > 1) {
          const localeItem = findItemByKey(match[1], localeItems);
          if (localeItem) {
            const currentLocalItemContent =
              oldLang in localeItem ? localeItem[oldLang] : undefined;
            const newLocaleItemContent =
              newLang in localeItem ? localeItem[newLang] : undefined;
            if (currentLocalItemContent && newLocaleItemContent) {
              const oldRendered = getTextCharacters(
                currentLocalItemContent,
                variables
              );
              const newRendered = getTextCharacters(
                newLocaleItemContent,
                variables
              );
              newString = newString.replace(
                match[0],
                getTextCharacters(newLocaleItemContent, variables)
              );
              keySegments.push({
                keyMatch: match,
                oldStart: oldCharacters.indexOf(oldRendered),
                oldEnd: oldCharacters.indexOf(oldRendered) + oldRendered.length,
                oldLength: oldRendered.length,
                newStart: newString.indexOf(newRendered),
                newLength: newRendered.length,
                newEnd: newString.indexOf(newRendered) + newRendered.length,
              });
            }
          }
        }
      });
      // set new content
      textNode.characters = newString;
      // adjust style
      let currentKey = 0;
      let currentCheckedCharacter = 0;
      styleSegments.forEach((segment) => {
        // // da xong key
        let segmentLength = segment.end - segment.start;
        for (let i = currentKey; i < keySegments.length; i++) {
          if (
            segment.end >= keySegments[i].oldEnd &&
            segment.start <= keySegments[i].oldStart
          ) {
            segmentLength +=
              keySegments[i].newLength - keySegments[i].oldLength;
            currentKey = i;
          }
        }
        const newStart = currentCheckedCharacter;
        const newEnd = currentCheckedCharacter + segmentLength;

        fields.forEach((field) => {
          const functionName = "setRange" + capitalizeFirstLetter(field);
          if (field in segment && functionName in textNode) {
            textNode[functionName](newStart, newEnd, segment[field]);
          }
        });

        currentCheckedCharacter = newEnd;
      });
    }
  }
}
// update texts to use Locale item
export function updateText(
  filterFunction: (node: TextNode) => boolean,
  textProps: LocaleTextProps,
  scope: SceneNode | BaseNode
) {
  const updateNodes = scope ? [scope] : selection();
  const textNodes: TextNode[] = [];
  updateNodes.forEach((parentNode) => {
    if (isContainer(parentNode) || parentNode.type == "PAGE") {
      textNodes.push(
        ...(parentNode.findAllWithCriteria({ types: ["TEXT"] }) as TextNode[])
      );
    }
    if (parentNode.type == "TEXT") {
      textNodes.push(parentNode);
    }
  });
  textNodes.filter(filterFunction).forEach((textNode) => {
    updateTextNode(textNode, textProps);
  });
}
// update Texts to lastest content
export function updateTexts(
  localeItems: LocaleItem[],
  scope?: SceneNode | BaseNode
) {
  const updateNodes = scope ? [scope] : selection();
  const textNodes: TextNode[] = [];
  updateNodes.forEach((parentNode) => {
    if (isContainer(parentNode) || parentNode.type == "PAGE") {
      textNodes.push(
        ...(parentNode.findAllWithCriteria({ types: ["TEXT"] }) as TextNode[])
      );
    }
    if (parentNode.type == "TEXT") {
      textNodes.push(parentNode);
    }
  });
  textNodes.forEach((textNode) => {
    const key = getKey(textNode);
    if (!key) return;
    // update text content
    const localeItem = findItemByKey(getKey(textNode), localeItems);
    if (localeItem) {
      updateTextNode(textNode, { item: localeItem });
    }
  });
}
export function updateTextByIds(
  ids: string | string[],
  textProps: LocaleTextProps,
  scope?: SceneNode | BaseNode
) {
  const filterFunction = (node: TextNode) =>
    (isString(ids) && node.id == ids) || ids.includes(node.id);
  updateText(filterFunction, textProps, scope);
  // updateSelection();
  // update that text in state
}
export default updateText;
