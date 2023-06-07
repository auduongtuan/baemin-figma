import React, { useEffect, useState } from "react";
import { Checkbox, CheckedState, Collapsible, getCheckedState } from "ds";
import LocaleItemRecord from "./LocaleItemRecord";
import {
  addSelectedItems,
  removeSelectedItems,
} from "../../state/localeAppSlice";
import { LocaleItem } from "../../../lib";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
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
          {listState.editMode && (
            <Checkbox
              disabled={items.every((item) => !item.isLocal)}
              checked={currentChecked}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onCheckedChange={(checked) => {
                if (checked === true) {
                  dispatch(
                    addSelectedItems(items.filter((item) => item.isLocal))
                  );
                }
                if (checked === false) {
                  dispatch(
                    removeSelectedItems(items.filter((item) => item.isLocal))
                  );
                }
              }}
            />
          )}
          <span className="grow">
            {name || "Ungrouped"} ({items.length})
          </span>
        </div>
      </Collapsible.Trigger>
      <Collapsible.Content className="pl-16 pb-8">
        {items.map((item) => (
          <LocaleItemRecord item={item} group={name} />
        ))}
      </Collapsible.Content>
    </Collapsible>
  );
};
export default LocaleItemListGroup;
