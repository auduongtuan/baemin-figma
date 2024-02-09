import updateSelection from "./updateSelection";
import * as h from "figma-helpers";
import { pluralize } from "@capaj/pluralize";
import { LocaleItem } from "../../lib";
import { updateTextNode } from "../text/updateText";
import { setFormula, setKey } from "../text/textProps";

function unsetKeyAndFormulaForSelection() {
  let count = 0;
  h.selection().forEach((selection) => {
    if (h.isText(selection)) {
      setKey(selection, "");
      setFormula(selection, "");
      count++;
    } else if (h.isContainer(selection)) {
      const texts = selection.findAllWithCriteria({
        types: ["TEXT"],
      }) as TextNode[];
      texts.forEach((textNode) => {
        setKey(textNode, "");
        setFormula(textNode, "");
        count++;
      });
    }
  });
  if (count > 0) {
    updateSelection();
  }
  figma.notify(`${count} ${pluralize("texts", count)} unset`);
}

export default unsetKeyAndFormulaForSelection;
