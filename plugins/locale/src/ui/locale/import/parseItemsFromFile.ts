import { ImportFile } from "./importState";
import { flat } from "@lib/helpers";

function parseItemsFromFile(importFiles: ImportFile[], libraryId: string) {
  let parsedLangItems = {};
  importFiles.forEach((fileObject) => {
    let parsedItems = {};
    const flattenItems = flat(fileObject.items);
    Object.keys(flattenItems).forEach((key) => {
      // const content = flattenItems[key].replaceAll(/\{\{\s*(length|quantity)\s*\}\}/g, '{{content}}');
      // parse key into plural group
      if (
        key.endsWith(".one") &&
        key.replace(/\.one$/, ".other") in flattenItems
      ) {
        const newKey = key.replace(/\.one$/, "");
        const newContent = {
          one: flattenItems[key],
          other: flattenItems[newKey + ".other"],
        };
        parsedItems[newKey] = newContent;
      } else if (
        key.endsWith(".other") &&
        key.replace(".other", ".one") in flattenItems
      ) {
        // newKey = key.replace(".other", "_other");
      } else {
        parsedItems[key] = flattenItems[key];
      }
    });
    parsedLangItems[fileObject.name.replace(".json", "")] = parsedItems;
  });
  const langs = Object.keys(parsedLangItems);
  if (langs.length > 0) {
    const keyList = Object.keys(parsedLangItems[langs[0]]);
    const currentTime = new Date().toJSON();
    return keyList.map((key) => {
      const translations = langs.reduce((acc, lang) => {
        if (key in parsedLangItems[lang]) {
          acc[lang] = parsedLangItems[lang][key];
        }
        return acc;
      }, {});
      return {
        key: key,
        ...translations,
        createdAt: currentTime,
        fromLibrary: libraryId,
        isLocal: true,
        imported: true,
      };
    });
  }

  return [];
}
export default parseItemsFromFile;
