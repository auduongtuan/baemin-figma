import { FormValues } from "./useLocaleForm";
import getItemFromFormValues from "./getItemFromFormValues";
import { store } from "@ui/state/store";
import { addLocaleItem, updateLocaleItem } from "@ui/state/localeSlice";
import { getLocaleSelection } from "@ui/state/helpers";
import { updateTextsOfItem } from "@ui/state/helpers";
import { runCommand } from "@ui/uiHelper";

export function updateItemHandler(values: FormValues) {
  // save on submit
  const { oldKey, oldFromLibrary, ...otherFormValues } = values;
  const localeSelection = getLocaleSelection();
  const localeItemData = getItemFromFormValues("update", otherFormValues);
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
  const localeItemData = getItemFromFormValues("quick-update", otherFormValues);
  store.dispatch(
    updateLocaleItem({ ...localeItemData, id: [oldFromLibrary, oldKey] })
  );
  // update selected text also
  if (localeSelection) updateTextsOfItem(null, localeItemData);
}

export function addItemHandler(values: FormValues) {
  const localeItemData = getItemFromFormValues("create", values);
  store.dispatch(addLocaleItem(localeItemData));
  runCommand("show_figma_notify", { message: "Item created" });
  return localeItemData;
}

export default updateItemHandler;
