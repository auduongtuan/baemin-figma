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
import changeText from "figma-helpers/changeText";
import { DEFAULT_FONTS } from "../../lib/constant";
function getData(node: BaseNode) {
  return getNodeData(node, `${PREFIX}data`);
}
function setData(node: BaseNode, data: SavedLocaleData) {
  return setNodeData(node, `${PREFIX}data`, JSON.stringify(data));
}
const isLocal = (node: SceneNode) => {
  return isFrame(node) || isComponent(node);
};
function getNodes() {
  return firstPage
    .findAll(
      (node) =>
        ((isFrame(node) || isComponent(node)) && getData(node) != "") ||
        (isInstance(node) && getData(node.mainComponent) != "")
    )
    .sort((a, b) => {
      return (
        Number(isLocal(b)) - Number(isLocal(a)) || b.name.localeCompare(a.name)
      );
    });
}
const getDataNodes = async () => {
  const all = getNodes();
  await changeText.loadFonts(DEFAULT_FONTS);
  const createMain = () => {
    const mainNode = createDataBlock();
    mainNode.name = DATA_FRAME_NAME;
    // default data
    setData(mainNode, {
      localeItems: [],
    });
    firstPage.appendChild(mainNode);
    all.push(mainNode);
    return mainNode;
  };
  const local: (FrameNode | ComponentNode)[] = all.filter((node) =>
    isLocal(node)
  ) as (FrameNode | ComponentNode)[];
  const main: FrameNode | ComponentNode =
    (all.find((node) => isLocal(node)) as FrameNode | ComponentNode) ||
    createMain();
  return {
    all,
    main,
    local,
  };
};

export async function getLocaleData() {
  // const localeData = await figma.clientStorage.getAsync('localeData');
  // setNodeData(mainLocaleDataFrame, `${PREFIX}main_document_id`, figma.root.id);
  let combinedLocaleData: SavedLocaleData = {
    localeItems: [],
  };
  const dataNodes = await getDataNodes();
  dataNodes.all.reverse().forEach((localeDataNode, i) => {
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
        main: localeDataNode.id === dataNodes.main.id,
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
      if (localeDataNode.id === dataNodes.main.id) {
        combinedLocaleData.sheetId = localeData.sheetId;
        combinedLocaleData.sheetName = localeData.sheetName;
        combinedLocaleData.modifiedTime = localeData.modifiedTime;
        // combinedLocaleData.localeItems = unionWith(
        //   localeData.localeItems,
        //   combinedLocaleData.localeItems,
        //   (a, b) => a.key == b.key
        // );
      }
      // old load code
      // combinedLocaleData.localeItems = unionWith(
      //   localeData.localeItems.map((item: LocaleItem) => ({
      //     ...item,
      //     fromLibrary: localeDataNode.id,
      //     isLocal: isLocalNode,
      //   })),
      //   combinedLocaleData.localeItems,
      //   (a, b) => a.key == b.key
      // );
      // new load code with duplicated feature
      combinedLocaleData.localeItems = localeData.localeItems.reduce(
        (acc: LocaleItem[], item: SavedLocaleItem) => {
          const duplicated = acc.find((accItem) => accItem.key === item.key);
          if (duplicated) {
            duplicated.duplicated = true;
          }
          acc.push({
            ...item,
            fromLibrary: localeDataNode.id,
            isLocal: isLocalNode,
            ...(duplicated ? { duplicated: true } : {}),
          });
          return acc;
        },
        combinedLocaleData.localeItems
      );
    } catch (e) {
      console.log(e);
    }
  });
  // console.log(localeItems);
  return combinedLocaleData;
}
export async function saveLocaleData(localeData: LocaleData) {
  // only save locale file
  if (localeData) {
    const dataNodes = await getDataNodes();
    const defaultLibraryId = dataNodes.main.id;
    const libraryGroups = groupBy(
      localeData.localeItems.filter((item) => item.isLocal),
      (item) => item.fromLibrary || defaultLibraryId
    );
    dataNodes.local.forEach((libraryNode) => {
      const libraryItems =
        libraryNode.id in libraryGroups ? libraryGroups[libraryNode.id] : [];
      const items: SavedLocaleItem[] = libraryItems.map((item) => {
        // remove from library and isLocal and duplicated
        const { fromLibrary, isLocal, duplicated, ...rest } = item;
        return rest;
      });
      setData(libraryNode, {
        localeItems: items,
      });
    });
  }
}
