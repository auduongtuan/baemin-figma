import {
  setNodeData,
  getNodeData,
  postData,
  isComponent,
  isInstance,
} from "figma-helpers";
const firstPage = figma.root.children[0];
import { PREFIX, DATA_FRAME_NAME } from "../../lib/constant";
import { LocaleData, LocaleItem } from "../../lib";
import { isFrame } from "figma-helpers";
import { unionWith, isArray } from "lodash";
function getData(node: BaseNode) {
  return getNodeData(node, `${PREFIX}data`);
}
function isMain(node: BaseNode) {
  return getNodeData(node, `${PREFIX}main_document_id`) === figma.root.id;
}
const localeDataNodes = firstPage
  .findAll(
    (node) =>
      ((isFrame(node) || isComponent(node)) && getData(node) != "") ||
      (isInstance(node) && getData(node.mainComponent) != "")
  )
  .sort((a, b) => {
    // console.log(isMain(b), isMain(a));
    return (
      Number(isFrame(b)) - Number(isFrame(a)) || b.name.localeCompare(a.name)
    );
  });
let mainLocaleDataFrame = localeDataNodes[0];
export function getLocaleData() {
  // const localeData = await figma.clientStorage.getAsync('localeData');
  // setNodeData(mainLocaleDataFrame, `${PREFIX}main_document_id`, figma.root.id);

  let combinedLocaleData: LocaleData = {
    localeItems: [],
  };

  localeDataNodes.reverse().forEach((localeDataNode, i) => {
    const nodeLocaleData = getData(localeDataNode);

    try {
      let localeData = JSON.parse(nodeLocaleData);
      // if

      if (!("localeLibraries" in combinedLocaleData)) {
        combinedLocaleData.localeLibraries = [];
      }
      combinedLocaleData.localeLibraries.push({
        id: localeDataNode.id,
        name: localeDataNode.name,
        local: i == localeDataNodes.length - 1,
      });

      // migrate to new typed system
      if ("items" in localeData) {
        localeData["localeItems"] = localeData.items;
        delete localeData["items"];
      }
      if ("localeItems" in localeData && isArray(localeData["localeItems"])) {
        localeData.localeItems.forEach((localeItem) => {
          if ("plurals" in localeItem) {
            localeItem.en = {};
            localeItem.en["one"] = localeItem.plurals.one.en;
            localeItem.en["other"] = localeItem.plurals.other.en;
            localeItem.vi = {};
            localeItem.vi["one"] = localeItem.plurals.one.vi;
            localeItem.vi["other"] = localeItem.plurals.other.vi;
            delete localeItem["plurals"];
          }
        });
      }
      // if main node
      if (i == localeDataNodes.length - 1) {
        combinedLocaleData.sheetId = localeData.sheetId;
        combinedLocaleData.sheetName = localeData.sheetName;
        combinedLocaleData.modifiedTime = localeData.modifiedTime;
        combinedLocaleData.localeItems = unionWith(
          localeData.localeItems,
          combinedLocaleData.localeItems,
          (a, b) => a.key == b.key
        );
      } else {
        combinedLocaleData.localeItems = unionWith(
          localeData.localeItems.map((item: LocaleItem) => ({
            ...item,
            fromLibrary: localeDataNode.id,
          })),
          combinedLocaleData.localeItems,
          (a, b) => a.key == b.key
        );
      }
    } catch (e) {
      console.log(e);
    }
  });
  // console.log(localeItems);
  postData({ type: "load_locale_data", localeData: combinedLocaleData });
}
export function saveLocaleData(localeData: LocaleData) {
  // await figma.clientStorage.setAsync('localeData', msg.localeData);
  // console.log('Saved', msg.localeData);
  // only save locale file
  if (localeData) {
    const filterLocaleData = localeData;
    filterLocaleData.localeItems = filterLocaleData.localeItems.filter(
      (localeItem) => !("fromLibrary" in localeItem) || !localeItem.fromLibrary
    );
    console.log("FILTERED LOCALE DATA", filterLocaleData);
    const localeDataString = JSON.stringify(filterLocaleData);
    if (!mainLocaleDataFrame) {
      mainLocaleDataFrame = figma.createFrame();
      mainLocaleDataFrame.resize(100, 100);
      mainLocaleDataFrame.name = DATA_FRAME_NAME;
      firstPage.appendChild(mainLocaleDataFrame);
    }
    // setNodeData(mainLocaleDataFrame, `${PREFIX}main_data`, '1');
    setNodeData(mainLocaleDataFrame, `${PREFIX}data`, localeDataString);
  }
}
