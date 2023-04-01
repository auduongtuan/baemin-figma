import * as h from "figma-helpers";
import { MIXED_VALUE } from "../../constant/locale";
import { LocaleText } from "../../lib/localeData";
import { getLang, getKey, getVariables } from "./common";
import { loadRobotoFontsAsync } from "figma-helpers";
import { truncate } from "lodash";
async function createAnnotation() {
  const selection = h.selection();
  console.log("Test annotation");
  await loadRobotoFontsAsync();
  // const stickyNoteComponent = await figma.importComponentByKeyAsync(
  //   "06f45208cc6f1b3749329a96de4c6e019c8809ca"
  // );
  const noteComponent = await figma.importComponentByKeyAsync("83180b94863f974cd3ab9420adbd14e3a6b7f714");
  figma.skipInvisibleInstanceChildren = false;

  selection.forEach((selectionItem) => {
    const allTexts: TextNode[] = [];

    if (h.isText(selectionItem)) {
      allTexts.push(selectionItem);
    }
    else if (
        h.isContainer(selectionItem)
    ) {
      allTexts.push(...(selectionItem.findAllWithCriteria({types: ['TEXT']}) as TextNode[]));
    }

  
  

    const stickyNode = noteComponent.createInstance();
    const title = stickyNode.findChild(
      (node) => h.isText(node) && node.name == "Title"
    ) as TextNode;
    const items = stickyNode.findChild(
      (node) => h.isFrame(node) && node.name == "Items"
    ) as FrameNode;
    if (title && items) {
      // title.characters = "i18n";
      // title.visible = false;
      let currentIndex = -1;
      allTexts.forEach((text) => {
        // id: textNode.id,
        const key = getKey(text);
        // const lang = getLang(textNode),
        // variables: getVariables(textNode),
        // characters: textNode.characters,
        if(key) {
          currentIndex++;
          const item = items.children[currentIndex];
          if(item && h.isInstance(item)) {
            item.visible = true;
            const indexTextNode = ((item.children[0] as FrameNode).children[0] as InstanceNode).children[0] as TextNode;
            const textTextNode = (item.children[1] as FrameNode).children[0] as TextNode;
            const keyTextNode = (item.children[1] as FrameNode).children[1] as TextNode;
            if(indexTextNode && textTextNode && keyTextNode) {
              indexTextNode.characters = (currentIndex+1).toString();
              textTextNode.characters = truncate(text.characters, { length: 80 });
              keyTextNode.characters = key;
            }
          }
        }
      })
      // note.characters = texts.reduce((acc, text, i) => {
      //   if (text.key) {
      //     acc +=
      //       truncate(text.characters, { length: 20 }) + ": " + text.key;
      //     if(i < texts.length - 1) acc += "\n";
      //   }
      //   return acc;
      // }, "");
      // note.setRangeListOptions(0, note.characters.length, {
      //   type: "UNORDERED",
      // });
      selectionItem.parent.appendChild(stickyNode);
      stickyNode.x = selectionItem.x - stickyNode.width - 24;
      stickyNode.y = selectionItem.y;
    }
    figma.skipInvisibleInstanceChildren = true;

  });
}
export default createAnnotation;
