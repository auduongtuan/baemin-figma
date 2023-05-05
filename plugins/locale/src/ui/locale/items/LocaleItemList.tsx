import React, { useState, useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { removeLocaleItem, updateLocaleItems } from "../../state/localeSlice";
import { useForm } from "react-hook-form";
import { groupBy, orderBy } from "lodash";
import { pluralize } from "@capaj/pluralize";
import {
  Button,
  IconButton,
  Dialog,
  Collapsible,
  Tooltip,
  Select,
  SelectOption,
  Divider,
} from "ds";
import {
  Crosshair2Icon,
  Pencil2Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { runCommand } from "../../uiHelper";
import { setCurrentDialog } from "../../state/localeAppSlice";
import LocaleItemForm from "../form/LocaleItemForm";
import { LocaleItem } from "../../../lib";
import LocaleItemRecord from "./LocaleItemRecord";
const LocaleItemList = ({
  action = true,
  filter = true,
  items,
}: {
  items?: LocaleItem[];
  action?: boolean;
  filter?: boolean;
}) => {
  const currentDialog = useAppSelector(
    (state) => state.localeApp.currentDialog
  );

  const [source, setSource] = useState("all");
  const filterFn = useCallback(
    (item: LocaleItem) => {
      if (source == "all") return true;
      if (source == "local")
        return !("fromLibrary" in item) || !item.fromLibrary;
      if (source == "library") return item.fromLibrary;
    },
    [source]
  );
  const localeItems = items
    ? items
    : useAppSelector((state) => state.locale.localeItems);
  const filteredLocaleItems = localeItems.filter(filterFn);
  const groupedLocaleItems = Object.entries(
    groupBy(orderBy(filteredLocaleItems, ["key"]), (item) => {
      const parts = item.key.split(".");
      if (parts.length >= 2) return parts[0];
      return "";
    })
  ).sort((a, b) => a[0].localeCompare(b[0]));
  const dispatch = useAppDispatch();
  const {
    register,
    // handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  // reset when key is change
  useEffect(() => {
    const watcher = watch((data) => {
      // if (matchedItem && data.key) {
      dispatch(
        updateLocaleItems(
          Object.keys(data).map((key) => {
            return { key: key, en: data[key].en, vi: data[key].vi };
          })
        )
      );

      // }
    });
    return () => {
      watcher.unsubscribe();
    };
  }, [watch]);

  return (
    <div
      className=""
      css={`
        position: relative;
      `}
    >
      <header
        css={`
          position: sticky;
          background: var(--figma-color-bg);
          z-index: 20;
          top: 0;
        `}
      >
        <div className="flex items-center px-16 py-4">
          {localeItems && (
            <h4 className="mt-0 flex-grow-1 font-medium text-secondary">
              {localeItems.length} locale{" "}
              {pluralize("item", localeItems.length)}
            </h4>
          )}
          {filter && (
            <div className="flex gap-8">
              <div className="items-center">
                <Select
                  inline
                  label="Source"
                  value="all"
                  options={[
                    { value: "all", name: "All" },
                    { value: "local", name: "Local" },
                    { value: "library", name: "Library" },
                  ]}
                  onChange={(value: string) => {
                    setSource(value);
                  }}
                />
              </div>
              <div className="inline-flex justify-center items-center">
                <Tooltip content="Add new item">
                  <IconButton
                    onClick={() =>
                      dispatch(setCurrentDialog({ type: "NEW", opened: true }))
                    }
                  >
                    <PlusIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
        <Divider />
      </header>
      <div className="p-16 flex gap-8 flex-column">
        {localeItems &&
          groupedLocaleItems &&
          groupedLocaleItems.map(([name, items]) => (
            <Collapsible defaultOpen={localeItems.length < 12}>
              <Collapsible.Trigger
                css={`
                  font-weight: var(--font-weight-medium);
                `}
              >
                {name || "Ungrouped"} ({items.length})
              </Collapsible.Trigger>
              <Collapsible.Content
                css={`
                  padding-left: 16px;
                  padding-bottom: 8px;
                `}
              >
                {items.map((item) => (
                  <LocaleItemRecord item={item} action={action} group={name} />
                ))}
              </Collapsible.Content>
            </Collapsible>
          ))}
      </div>
    </div>
  );
};

export default LocaleItemList;
