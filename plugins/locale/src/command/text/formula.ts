// unused file
import * as h from "figma-helpers";
import { LANGUAGES } from "../../lib/constant";
import { DEFAULT_LANG } from "../../lib/constant";
import {
  Lang,
  LocaleItem,
  LocaleTextProps,
  applyVariablesToContent,
  findItemByKey,
} from "../../lib";
import { matchAll } from "../../lib/helpers";
import { getVariables, setKey, setLang, setVariables } from "./textProps";
import updateSelection from "../selection/updateSelection";
function updateTextNode(
  textNode: TextNode,
  textProps: LocaleTextProps,
  localeItems?: LocaleItem[]
) {
  if (textProps) {
    if (textProps.key && !textProps.item && !textProps.item.key) {
      setKey(textNode, textProps.key);
    }
    if (textProps.key === "") setKey(textNode, textProps.key);
    if (textProps.lang) setLang(textNode, textProps.lang || DEFAULT_LANG);
    if (textProps.variables) setVariables(textNode, textProps.variables);
  }
  // update text content
  // if (textProps.item) {
  //   const currentLang = getLang(textNode) || DEFAULT_LANG;
  //   const localeItemContent = textProps.item[currentLang];
  //   const variables = getVariables(textNode);
  //   if(isPlurals(localeItemContent) && !variables.count) {
  //     setVariable(textNode, 'count', 1);
  //     variables.count = 1;
  //   }
  //   setKey(textNode, textProps.item.key);
  //   // NON PLURAL
  //   textNode.characters = getTextCharacters(localeItemContent, variables);
  // }
  if (textProps.formula) {
    console.log(textNode.characters);
    console.log(textProps.formula);
    let newString = textProps.formula;
    const currentLang = "vi";
    const newLang = "en";
    const variables = getVariables(textNode);
    const matches = matchAll(
      /\$\{\s*([A-Za-z0-9\._]+)\s*\}/,
      textProps.formula
    );
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
    let currentSegmentChecked = -1;
    console.log("Style segments", styleSegments);
    const keySegments = [];
    if (matches) {
      matches.forEach((match: string[]) => {
        if (match.length > 1) {
          const localeItem = findItemByKey(match[1], localeItems);
          if (localeItem) {
            const currentLocalItemContent =
              currentLang in localeItem ? localeItem[currentLang] : undefined;
            const newLocaleItemContent =
              currentLang in localeItem ? localeItem[newLang] : undefined;
            if (currentLocalItemContent && newLocaleItemContent) {
              const oldRendered = applyVariablesToContent(
                currentLocalItemContent,
                variables
              );
              const newRendered = applyVariablesToContent(
                newLocaleItemContent,
                variables
              );
              console.log(oldRendered);
              console.log(
                "index old character",
                oldCharacters.indexOf(oldRendered)
              );
              newString = newString.replace(
                match[0],
                applyVariablesToContent(newLocaleItemContent, variables)
              );
              console.log(
                "index new character",
                newString.indexOf(newRendered)
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
      textNode.characters = newString;
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
function changeLang(textNode: TextNode, lang, localeItems: LocaleItem[]) {
  const localeItem = findItemByKey("common.log_in", localeItems);
  const formula =
    "huhu ${common.log_in} va\nne ${login.forgot_password} hehe\nkho";
  // const localeItem = findItemByKey(getKey(textNode), localeItems);
  // turn off find by characters because of speed
  //  || findItemByCharacters(textNode.characters, localeItems);
  console.log("Item test", localeItem);
  if (localeItem)
    updateTextNode(
      textNode,
      { lang, item: localeItem, formula: formula },
      localeItems
    );
}
function test(
  lang: Lang,
  localeItems: LocaleItem[],
  scope?: SceneNode | BaseNode
) {
  const updateNodes = scope ? [scope] : h.selection();
  updateNodes.forEach((selection) => {
    if (h.isText(selection)) {
      changeLang(selection, lang, localeItems);
    } else if (h.isContainer(selection)) {
      const texts = selection.findAllWithCriteria({
        types: ["TEXT"],
      }) as TextNode[];
      texts.forEach((textNode) => {
        changeLang(textNode, lang, localeItems);
      });
    }
  });
  figma.notify(`Switched selection to ${LANGUAGES[lang]}`);
  updateSelection();
}

export default test;
