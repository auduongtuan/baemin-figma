import { updateTextsInLocaleSelection } from "../../state/localeSlice";
import { LocaleItem, LocaleSelection } from "../../../lib";
import { applyVariablesToContent } from "../../../lib/localeText";
import { runCommand } from "../../uiHelper";
import { store } from "../../state/store";

export function updateTextsOfItem(
  oldKey: string,
  item: LocaleItem,
  localeSelection: LocaleSelection
) {
  // newKey
  // update selected text also
  const texts = localeSelection.texts.filter(
    (text) =>
      (oldKey && text.key == oldKey) || (!oldKey && text.key == item.key)
  );
  texts.forEach((text) => {
    runCommand("update_texts", {
      ids: text.id,
      item: item,
    });
  });

  store.dispatch(
    updateTextsInLocaleSelection(
      texts.map((text) => ({
        ...text,
        key: item.key,
        characters: applyVariablesToContent(item[text.lang], text.variables),
      }))
    )
  );
}
