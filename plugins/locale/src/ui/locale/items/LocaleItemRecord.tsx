import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { IconButton, Tooltip, Tag } from "ds";
import { Crosshair2Icon } from "@radix-ui/react-icons";
import { runCommand } from "../../uiHelper";
import { LocaleItem } from "../../../lib";
import { getLibraryName } from "../../state/helpers";
import { DeleteDialogTrigger } from "../dialogs/DeleteDialog";
import { EditDialogTrigger } from "../dialogs/EditDialog";
const LocaleItemRecord = ({
  item,
  action = true,
  group,
}: {
  item: LocaleItem;
  action?: boolean;
  group?: string;
}) => {
  return (
    <div className="border-b border-divider py-8 last:border-b-0 last:pb-0">
      <div className="text-left font-normal flex w-full gap-8 text-small group">
        <div className="w-full shrink basis-auto flex min-w-0">
          <div className="truncate">
            {group ? item.key.replace(new RegExp(`^${group}\.`), "") : item.key}
          </div>
          <div className="grow-0 shrink-0">
            {!item.isLocal && (
              <Tooltip
                content={
                  <>
                    {`From an external library (${getLibraryName(
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
          <div className="opacity-0 group-hover:opacity-1 flex gap-12 grow-0 shrink-0">
            {item.isLocal && (
              <>
                <EditDialogTrigger item={item} />
                <DeleteDialogTrigger item={item} />
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
