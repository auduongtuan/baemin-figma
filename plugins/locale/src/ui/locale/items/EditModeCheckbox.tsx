import { Checkbox, getCheckedState } from "ds";
import { LocaleItem } from "@lib";
import { useAppDispatch, useAppSelector } from "@ui/hooks/redux";
import {
  addSelectedItems,
  removeSelectedItems,
} from "@ui/state/localeAppSlice";
const EditModeCheckbox = ({ items }: { items: LocaleItem[] }) => {
  const listState = useAppSelector((state) => state.localeApp.list);
  const localItems = items.filter((item) => item.isLocal);
  const dispatch = useAppDispatch();
  return (
    <Checkbox
      disabled={items.every((item) => !item.isLocal)}
      checked={getCheckedState(items, listState.selectedItems)}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onCheckedChange={(checked) => {
        if (checked === true) {
          dispatch(addSelectedItems(localItems));
        }
        if (checked === false) {
          dispatch(removeSelectedItems(localItems));
        }
      }}
    />
  );
};
export default EditModeCheckbox;
