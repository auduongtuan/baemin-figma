import {
  setNodeData,
  getNodeData,
  isComponent,
  isInstance,
} from "figma-helpers";
import { PREFIX, DATA_FRAME_NAME } from "../../lib/constant";
import {
  SavedLocaleData,
  LocaleData,
  LocaleItem,
  SavedLocaleItem,
} from "../../lib";
import { isFrame } from "figma-helpers";
import { createDataBlock } from "./dataBlock";
import { unionWith, isArray, groupBy } from "lodash-es";
const firstPage = figma.root.children[0];
function getData(node: BaseNode) {
  return getNodeData(node, `${PREFIX}data`);
}
function isMain(node: BaseNode) {
  return getNodeData(node, `${PREFIX}main_document_id`) === figma.root.id;
}
const isLocal = (node: SceneNode) => {
  return isFrame(node) || isComponent(node);
};
const localeDataNodes = firstPage
  .findAll(
    (node) =>
      ((isFrame(node) || isComponent(node)) && getData(node) != "") ||
      (isInstance(node) && getData(node.mainComponent) != "")
  )
  .sort((a, b) => {
    // console.log(isMain(b), isMain(a));
    return (
      Number(isLocal(b)) - Number(isLocal(a)) || b.name.localeCompare(a.name)
    );
  });
// first local node
let mainLocaleDataFrame = localeDataNodes.find((node) => isLocal(node));
export function getLocaleData() {
  // const localeData = await figma.clientStorage.getAsync('localeData');
  // setNodeData(mainLocaleDataFrame, `${PREFIX}main_document_id`, figma.root.id);

  let combinedLocaleData: SavedLocaleData = {
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
      combinedLocaleData.localeLibraries.unshift({
        id: localeDataNode.id,
        name: localeDataNode.name,
        local: isLocal(localeDataNode),
        main: localeDataNode.id === mainLocaleDataFrame.id,
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
      // end migrate

      // if main node
      const isLocalNode = isLocal(localeDataNode);
      if (localeDataNode.id === mainLocaleDataFrame.id) {
        combinedLocaleData.sheetId = localeData.sheetId;
        combinedLocaleData.sheetName = localeData.sheetName;
        combinedLocaleData.modifiedTime = localeData.modifiedTime;
        // combinedLocaleData.localeItems = unionWith(
        //   localeData.localeItems,
        //   combinedLocaleData.localeItems,
        //   (a, b) => a.key == b.key
        // );
      }
      combinedLocaleData.localeItems = unionWith(
        localeData.localeItems.map((item: LocaleItem) => ({
          ...item,
          fromLibrary: localeDataNode.id,
          isLocal: isLocalNode,
        })),
        combinedLocaleData.localeItems,
        (a, b) => a.key == b.key
      );
    } catch (e) {
      console.log(e);
    }
  });
  // console.log(localeItems);
  return combinedLocaleData;
}
export function saveLocaleData(localeData: LocaleData) {
  // only save locale file
  if (localeData) {
    if (!mainLocaleDataFrame) {
      mainLocaleDataFrame = createDataBlock();
      mainLocaleDataFrame.name = DATA_FRAME_NAME;
      firstPage.appendChild(mainLocaleDataFrame);
    }
    const defaultLibraryId = mainLocaleDataFrame.id;
    const libraryGroups = groupBy(
      localeData.localeItems.filter((item) => item.isLocal),
      (item) => item.fromLibrary || defaultLibraryId
    );
    Object.keys(libraryGroups).forEach((libraryId) => {
      const libraryItems = libraryGroups[libraryId];
      const libraryNode = figma.getNodeById(libraryId);
      if (libraryNode) {
        const items: SavedLocaleItem[] = libraryItems.map((item) => {
          // remove from library and isLocal
          const { fromLibrary, isLocal, ...rest } = item;
          return rest;
        });
        setNodeData(
          libraryNode,
          `${PREFIX}data`,
          JSON.stringify({
            localeItems: items,
          })
        );
      }
    });
  }
}
