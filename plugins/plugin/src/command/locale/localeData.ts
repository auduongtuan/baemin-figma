import { setNodeData, getNodeData, postData } from "figma-helpers";
const firstPage = figma.root.children[0];
import { PREFIX, DATA_FRAME_NAME } from "../../constant/locale";
import { LocaleData } from "../../lib/localeData";
let localeDataFrame = firstPage.findOne(
  (node) => getNodeData(node, `${PREFIX}data`) != ""
);
export function getLocaleData() {
  // const localeData = await figma.clientStorage.getAsync('localeData');
  let localeData = {};
  if (localeDataFrame) {
    localeData = getNodeData(localeDataFrame, `${PREFIX}data`);
  }
  // console.log(localeItems);
  postData({ type: "load_locale_data", localeData });
}
export function saveLocaleData(localeDataString: string) {
  // await figma.clientStorage.setAsync('localeData', msg.localeData);
  // console.log('Saved', msg.localeData);
  if (!localeDataFrame) {
    localeDataFrame = figma.createFrame();
    localeDataFrame.resize(100, 100);
    localeDataFrame.name = DATA_FRAME_NAME;
    firstPage.appendChild(localeDataFrame);
  }
  setNodeData(localeDataFrame, `${PREFIX}data`, localeDataString);
}