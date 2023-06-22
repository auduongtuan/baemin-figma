import { FormValues } from "./useLocaleForm";
import getLocaleItemFromContent from "./getLocaleItemFromContent";
import { store } from "@ui/state/store";
import { setCurrentDialog } from "@ui/state/localeAppSlice";
import { addLocaleItem, updateLocaleItem } from "@ui/state/localeSlice";
import { getLocaleSelection } from "@ui/state/helpers";
import { updateTextsOfItem } from "@ui/state/helpers";
import { runCommand } from "@ui/uiHelper";
export function updateItemHandler(values: FormValues) {
  // save on submit
  const { oldKey, oldFromLibrary, ...otherFormValues } = values;
  const localeSelection = getLocaleSelection();
  const localeItemData = getLocaleItemFromContent("update", otherFormValues);
  store.dispatch(setCurrentDialog({ type: "EDIT", opened: false }));
  store.dispatch(
    updateLocaleItem({ ...localeItemData, id: [oldFromLibrary, oldKey] })
  );
  if (localeSelection) updateTextsOfItem(oldKey, localeItemData);
  runCommand("show_figma_notify", { message: "Item updated" });
  return localeItemData;
}
export function quickUpdateItemHandler(values: FormValues) {
  const { oldKey, oldFromLibrary, ...otherFormValues } = values;
  const localeSelection = getLocaleSelection();
  const localeItemData = getLocaleItemFromContent(
    "quick-update",
    otherFormValues
  );
  console.log(localeItemData);
  store.dispatch(
    updateLocaleItem({ ...localeItemData, id: [oldFromLibrary, oldKey] })
  );
  // update selected text also
  if (localeSelection) updateTextsOfItem(null, localeItemData);
}

export function addItemHandler(values: FormValues) {
  const localeItemData = getLocaleItemFromContent("create", values);
  store.dispatch(addLocaleItem(localeItemData));
  runCommand("show_figma_notify", { message: "Item created" });
  return localeItemData;
}

export default updateItemHandler;
