import React, { useEffect, useState } from "react";
import { Checkbox, CheckedState, Collapsible, getCheckedState } from "ds";
import LocaleItemRecord from "./LocaleItemRecord";
import {
  addSelectedItems,
  removeSelectedItems,
} from "../../state/localeAppSlice";
import { LocaleItem } from "../../../lib";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import EditModeCheckbox from "./EditModeCheckbox";
const LocaleItemListGroup = ({
  defaultExpanded,
  name,
  items,
}: {
  defaultExpanded: boolean;
  name: string;
  items: LocaleItem[];
}) => {
  const listState = useAppSelector((state) => state.localeApp.list);
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(defaultExpanded);
  const currentChecked = getCheckedState(items, listState.selectedItems);
  return (
    <Collapsible
      key={listState.source + name}
      open={open}
      onOpenChange={setOpen}
    >
      <Collapsible.Trigger className="font-medium">
        <div className="flex gap-8">
          {listState.editMode && <EditModeCheckbox items={items} />}
          <span className="grow">
            {name || "Ungrouped"} ({items.length})
          </span>
        </div>
      </Collapsible.Trigger>
      <Collapsible.Content className="pb-8 pl-16">
        {items.map((item) => (
          <LocaleItemRecord item={item} group={name} />
        ))}
      </Collapsible.Content>
    </Collapsible>
  );
};
export default LocaleItemListGroup;
