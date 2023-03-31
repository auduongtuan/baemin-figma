import React, { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import Button from "../../components/Button";
import Tooltip from "../../components/Tooltip";
import { removeLocaleItem, updateLocaleItems } from "../../state/localeSlice";
import { useForm } from "react-hook-form";
import { groupBy, orderBy } from "lodash";
import { IconButton } from "../../components/Button";
import { Crosshair2Icon, Pencil2Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { runCommand } from "../../uiHelper";
import {
  setCurrentDialog
} from "../../state/localeAppSlice";
import Dialog from "../../components/Dialog";
import LocaleItemForm from "../form/LocaleItemForm";
import { LocaleItem } from "../../../lib/localeData";
import Collapsible from "../../components/Collapsible";
import LocaleItemRecord from "./LocaleItemRecord";
const LocaleItemList = () => {
  const currentDialog = useAppSelector(
    (state) => state.localeApp.currentDialog
  );
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const groupedLocaleItems = Object.entries(groupBy(orderBy(localeItems, ["key"]), (item) => {
    const parts = item.key.split(".");
    if (parts.length >= 2) return parts[0];
    return "";
  })).sort((a, b) => a[0].localeCompare(b[0]));
  console.log(groupedLocaleItems);
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
    <div className="p-16">
      <header className="flex">
        {localeItems && (
          <h4 className="mt-0 flex-grow-1 font-medium text-secondary">
            {localeItems.length} locale items
          </h4>
        )}
        <div>
          <Tooltip content="Add new item">
            <IconButton onClick={() => dispatch(setCurrentDialog({type: 'NEW', opened: true}))}>
              <PlusIcon />
            </IconButton>
          </Tooltip>
        </div>
      </header>
      <div
        className="mt-8 flex gap-8 flex-column"
      >
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
              <Collapsible.Content css={`
                padding-left: 16px;
              `}>
                {items.map((item) => (
                  <LocaleItemRecord item={item} />
                ))}
              </Collapsible.Content>
            </Collapsible>
          ))}
      </div>
    </div>
  );
};

export default LocaleItemList;
