import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Button, IconButton, Dialog, Tooltip, Tag } from "ds";
import { removeLocaleItem } from "../../state/localeSlice";
import { Crosshair2Icon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { runCommand } from "../../uiHelper";
import { setCurrentDialog } from "../../state/localeAppSlice";
import LocaleItemForm from "../form/LocaleItemForm";
import { LocaleItem } from "../../../lib";
import { getLibraryName } from "../../state/helpers";
const LocaleItemRecord = ({
  item,
  action = true,
  group,
}: {
  item: LocaleItem;
  action?: boolean;
  group?: string;
}) => {
  const currentDialog = useAppSelector(
    (state) => state.localeApp.currentDialog
  );
  const dispatch = useAppDispatch();
  const deleteLocaleItemHandler = useCallback(() => {
    dispatch(removeLocaleItem(item));
    dispatch(setCurrentDialog({ opened: false }));
    runCommand("show_figma_notify", { message: "Item removed" });
  }, [item]);
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
        <div className="w-full flex-shrink-1 basis-auto flex min-w-0">
          <div className="truncate">
            {group ? item.key.replace(new RegExp(`^${group}\.`), "") : item.key}
          </div>
          <div className="flex-grow-0 flex-shrink-0">
            {!item.isLocal && (
              <Tooltip
                content={
                  <>
                    {`This item is from a external library (${getLibraryName(
                      item.fromLibrary as string
                    )}).`}
                    <br />
                    {`To edit it, open the original file.`}
                  </>
                }
              >
                <Tag className="ml-4">EXT</Tag>
              </Tooltip>
            )}
          </div>
        </div>
        {action && (
          <div className="actions flex gap-12 flex-grow-0 flex-shrink-0">
            {item.isLocal && (
              <>
                <Dialog
                  open={
                    currentDialog.opened &&
                    currentDialog.type == "EDIT" &&
                    currentDialog.key == item.key
                  }
                  onOpenChange={(open) => {
                    dispatch(
                      setCurrentDialog({
                        type: "EDIT",
                        key: item.key,
                        opened: open,
                      })
                    );
                  }}
                >
                  <Tooltip content="Edit this key">
                    <Dialog.Trigger asChild>
                      <IconButton>
                        <Pencil2Icon></Pencil2Icon>
                      </IconButton>
                    </Dialog.Trigger>
                  </Tooltip>
                  <Dialog.Panel title="Edit locale item">
                    <Dialog.Content>
                      <LocaleItemForm
                        item={item}
                        showTitle={false}
                        saveOnChange={false}
                      />
                    </Dialog.Content>
                  </Dialog.Panel>
                </Dialog>
                <Dialog
                  open={
                    currentDialog.opened &&
                    currentDialog.type == "DELETE" &&
                    currentDialog.key == item.key
                  }
                  onOpenChange={(open) => {
                    dispatch(
                      setCurrentDialog({
                        type: "DELETE",
                        key: item.key,
                        opened: open,
                      })
                    );
                  }}
                >
                  <Tooltip content="Delete this item">
                    <Dialog.Trigger asChild>
                      <IconButton>
                        <TrashIcon></TrashIcon>
                      </IconButton>
                    </Dialog.Trigger>
                  </Tooltip>
                  <Dialog.Panel title="Delete locale item">
                    <Dialog.Content>
                      Are you sure you want to delete{" "}
                      <strong>{item.key}</strong>?
                      <Button
                        // variant="secondary"
                        destructive
                        className="mt-16"
                        onClick={deleteLocaleItemHandler}
                      >
                        Delete item
                      </Button>
                    </Dialog.Content>
                  </Dialog.Panel>
                </Dialog>
              </>
            )}
            <Tooltip content="Select texts with this key">
              <IconButton
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  runCommand("show_figma_notify", {
                    message: `Finding texts with key ${item.key}...`,
                  });
                  runCommand("select_texts", { key: item.key });
                  e.stopPropagation();
                }}
              >
                <Crosshair2Icon></Crosshair2Icon>
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocaleItemRecord;
