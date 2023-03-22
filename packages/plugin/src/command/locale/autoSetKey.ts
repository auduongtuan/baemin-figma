import updateSelection from "./updateSelection";
import { autoSetKey } from "./common";
import * as h from '../commandHelper';
import {pluralize} from "@capaj/pluralize";
import { LocaleItem } from "../../lib/localeData";

function autoSetKeyForSelection(localeItems: LocaleItem[]) {
  let count = 0;
  h.selection().forEach((selection) => {
    if (h.isText(selection)) {
      autoSetKey(selection, localeItems, () => count++);
    } else if (h.isContainer(selection)) {
      const texts = selection.findAll((node) => h.isText(node)) as TextNode[];
      texts.forEach((textNode) => {
        autoSetKey(textNode, localeItems, () => count++);
      });
    }
  });
  figma.notify(`${count} ${pluralize('texts', count)} assigned`);
}
export default autoSetKeyForSelection;