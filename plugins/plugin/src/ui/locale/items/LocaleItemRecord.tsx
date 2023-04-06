import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {Button, IconButton, Dialog, Tooltip, Tag} from "ds";
import { removeLocaleItem } from "../../state/localeSlice";
import { Crosshair2Icon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { runCommand } from "../../uiHelper";
import {
  setCurrentDialog
} from "../../state/localeAppSlice";
import LocaleItemForm from "../form/LocaleItemForm";
import { LocaleItem } from "../../../lib/localeData";
const LocaleItemRecord = ({ item }: { item: LocaleItem }) => {
  const currentDialog = useAppSelector(
    (state) => state.localeApp.currentDialog
  );
  const dispatch = useAppDispatch();
  const deleteLocaleItemHandler = useCallback(() => {
    dispatch(removeLocaleItem(item));
    dispatch(setCurrentDialog({opened: false}))
    runCommand("show_figma_notify", {message: "Item removed"});
  }, [item])
  return (
    <div
      css={`
        border-bottom: 1px solid var(--figma-color-border);
        padding: 8px 0;
        &:last-child {
          border-bottom: 0;
          padding-bottom: 0;
        }
      `}
    >
      {/* <Accordion type="single" key={item.key + "_edit"} collapsible>
<Accordion.Item
title={ */}
      <div
        className="text-left font-normal flex w-full gap-8"
        css={`
          font-size: var(--font-size-small);
          & .actions {
            opacity: 0;
          }
          &:hover .actions {
            opacity: 1;
          }
        `}
      >
        <div className="flex-grow-1 flex-shrink-1 truncate">{item.key}{item.fromLibrary && <Tooltip content="This item is from a library. To edit it, open the original file."><Tag className="ml-4">LIB</Tag></Tooltip>}</div>
        <div className="actions flex gap-12 flex-grow-0 flex-shrink-0">
          {!item.fromLibrary && <>
          <Dialog
            open={currentDialog.opened && currentDialog.type == 'EDIT' && currentDialog.key == item.key}
            onOpenChange={(open) => {
              dispatch(setCurrentDialog({type: 'EDIT', key: item.key, opened: open}));
            }}
          >
            <Tooltip content="Edit this key">
              <Dialog.Trigger asChild>
                <IconButton>
                  <Pencil2Icon></Pencil2Icon>
                </IconButton>
              </Dialog.Trigger>
            </Tooltip>
            <Dialog.Content title="Edit locale item">
              <LocaleItemForm
                item={item}
                showTitle={false}
                saveOnChange={false}
              />
          </Dialog.Content>
          </Dialog>
          <Dialog
            open={currentDialog.opened && currentDialog.type == 'DELETE' && currentDialog.key == item.key}
            onOpenChange={(open) => {
              dispatch(setCurrentDialog({type: 'DELETE', key: item.key, opened: open}));
            }}
          >
            <Tooltip content="Delete this item">
              <Dialog.Trigger asChild>
                <IconButton>
                  <TrashIcon></TrashIcon>
                </IconButton>
              </Dialog.Trigger>
            </Tooltip>
            <Dialog.Content title="Delete locale item">
             Are you sure you want to delete this locale item?
             <Button
                // variant="secondary"
                destructive
                className="mt-16"
                onClick={deleteLocaleItemHandler}
              >
                Delete item
              </Button>
            </Dialog.Content>
          </Dialog>
          </>}
          <Tooltip content="Select texts with this key">
            <IconButton
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                runCommand("select_texts", { key: item.key });
                e.stopPropagation();
              }}
            >
              <Crosshair2Icon></Crosshair2Icon>
            </IconButton>
          </Tooltip>
        </div>
      </div>

    </div>
  );
};

export default LocaleItemRecord;