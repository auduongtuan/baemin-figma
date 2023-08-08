import {
  setNodeData,
  getNodeData,
  isComponent,
  isInstance,
} from "figma-helpers";
import { PREFIX, DATA_FRAME_NAME } from "@lib/constant";
import {
  SavedLocaleData,
  LocaleData,
  LocaleItem,
  SavedLocaleItem,
  addDuplicatedPropToItems,
} from "@lib";
import { isFrame } from "figma-helpers";
import { createDataBlock } from "./dataBlock";
import { groupBy } from "lodash-es";

const firstPage = figma.root.children[0];

export type DataNode = FrameNode | ComponentNode | InstanceNode;
export type LocalDataNode = FrameNode | ComponentNode;

export interface ClassifiedDataNodeObject {
  all: DataNode[];
  main: LocalDataNode;
  local: LocalDataNode[];
}

export interface DataNodeInfo {
  library: {
    id: string;
    name: string;
    local: boolean;
    main: boolean;
  };
  items: LocaleItem[];
  sheetId?: string;
  sheetName?: string;
  modifiedTime?: string;
}

function getData(node: BaseNode) {
  return getNodeData(node, `${PREFIX}data`);
}
function setData(node: BaseNode, data: SavedLocaleData) {
  return setNodeData(node, `${PREFIX}data`, JSON.stringify(data));
}
export const isDataNode = (node: SceneNode): node is DataNode => {
  return (
    ((isFrame(node) || isComponent(node)) && getData(node) != "") ||
    (isInstance(node) && getData(node.mainComponent) != "")
  );
};
export const isLocalDataNode = (node: SceneNode): node is LocalDataNode => {
  return isFrame(node) || isComponent(node);
};
export function getDataNodes(): DataNode[] {
  const dataNodes = firstPage.findAll(isDataNode) as DataNode[];
  return dataNodes.sort((a, b) => {
    return (
      Number(isLocalDataNode(b)) - Number(isLocalDataNode(a)) ||
      b.name.localeCompare(a.name)
    );
  });
}
function createMainDataNode() {
  const mainNode = createDataBlock();
  mainNode.name = DATA_FRAME_NAME;
  // default data
  setData(mainNode, {
    localeItems: [],
  });
  firstPage.appendChild(mainNode);
  return mainNode;
}

function getClassifiedDataNodes(): ClassifiedDataNodeObject {
  const all = getDataNodes();
  // await changeText.loadFonts(DEFAULT_FONTS);
  const local: LocalDataNode[] = all.filter((node) =>
    isLocalDataNode(node)
  ) as LocalDataNode[];
  const main: FrameNode | ComponentNode = all.find((node) =>
    isLocalDataNode(node)
  ) as LocalDataNode;
  return {
    all,
    main,
    local,
  };
}

export function parseDataNodeInfo(
  dataNode: DataNode,
  mainDataNode?: DataNode
): DataNodeInfo {
  const nodeLocaleData = getData(dataNode);

  try {
    let localeData = JSON.parse(nodeLocaleData);
    // if
    const { sheetId, sheetName, modifiedTime } = localeData;
    const library = {
      id: dataNode.id,
      name: dataNode.name,
      local: isLocalDataNode(dataNode),
      main: mainDataNode ? dataNode.id === mainDataNode.id : false,
    };

    // if main node
    const isLocalNode = isLocalDataNode(dataNode);

    // New load code with duplicated feature
    const items = localeData.localeItems.reduce(
      (acc: LocaleItem[], item: SavedLocaleItem) => {
        acc.push({
          ...item,
          fromLibrary: dataNode.id,
          isLocal: isLocalNode,
        });
        return acc;
      },
      []
    );
    return {
      library,
      items,
      sheetId,
      sheetName,
      modifiedTime,
    };
  } catch (e) {
    console.log(e);
  }
}
export function getLocaleDataWithCreatingMain() {
  const dataNodes = getClassifiedDataNodes();
  if (!dataNodes.main && figma.mode != "codegen" && figma.editorType != "dev")
    createMainDataNode();
  return getLocaleData();
}

export function getLocaleData() {
  // const localeData = await figma.clientStorage.getAsync('localeData');
  // setNodeData(mainLocaleDataFrame, `${PREFIX}main_document_id`, figma.root.id);
  let combinedLocaleData: LocaleData = {
    localeItems: [],
    localeLibraries: [],
  };
  const dataNodes = getClassifiedDataNodes();
  dataNodes.all.reverse().forEach((localeDataNode, i) => {
    const dataNodeInfo = parseDataNodeInfo(localeDataNode, dataNodes.main);
    if (dataNodeInfo.library.main) {
      combinedLocaleData.sheetId = dataNodeInfo.sheetId;
      combinedLocaleData.sheetName = dataNodeInfo.sheetName;
      combinedLocaleData.modifiedTime = dataNodeInfo.modifiedTime;
    }
    combinedLocaleData.localeLibraries.unshift(dataNodeInfo.library);
    combinedLocaleData.localeItems = addDuplicatedPropToItems([
      ...combinedLocaleData.localeItems,
      ...dataNodeInfo.items,
    ]);
  });
  // console.log(localeItems);
  return combinedLocaleData;
}
export function updateData(dataNode: DataNode, items: LocaleItem[]) {
  const savedItems: SavedLocaleItem[] = items.map((item) => {
    const { fromLibrary, isLocal, duplicated, ...rest } = item;
    return rest;
  });
  setData(dataNode, {
    localeItems: savedItems,
  });
}
export async function saveLocaleData(localeData: LocaleData) {
  // only save locale file
  if (localeData) {
    const dataNodes = getClassifiedDataNodes();
    const defaultLibraryId = dataNodes.main?.id;
    const libraryGroups = groupBy(
      localeData.localeItems.filter((item) => item.isLocal),
      (item) => item.fromLibrary || defaultLibraryId
    );
    dataNodes.local.forEach((libraryNode) => {
      const libraryItems =
        libraryNode.id in libraryGroups ? libraryGroups[libraryNode.id] : [];
      updateData(libraryNode, libraryItems);
    });
  }
}
