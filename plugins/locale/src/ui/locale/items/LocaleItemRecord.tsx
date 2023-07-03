import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { IconButton, Tooltip, Tag, Checkbox, DuplicationIcon } from "ds";
import { ComponentInstanceIcon, Crosshair2Icon } from "@radix-ui/react-icons";
import { runCommand } from "../../uiHelper";
import { LocaleItem, getStringContent } from "@lib";
import { getLibraryName } from "../../state/helpers";
import { DeleteDialogTrigger } from "../dialogs/DeleteDialog";
import { EditDialogTrigger } from "../dialogs/EditDialog";
import {
  addSelectedItems,
  removeSelectedItems,
} from "../../state/localeAppSlice";
import { useConfigs } from "@ui/hooks/locale";
const LocaleItemRecord = ({
  item,
  action = true,
  group,
}: {
  item: LocaleItem;
  action?: boolean;
  group?: string;
}) => {
  const { selectedItems, editMode } = useAppSelector(
    (state) => state.localeApp.list
  );
  const dispatch = useAppDispatch();
  const { defaultLanguage } = useConfigs();
  const itemKey = useMemo(
    () => (group ? item.key.replace(new RegExp(`^${group}\.`), "") : item.key),
    [item, group]
  );
  const itemContentDemo = useMemo(
    () =>
      defaultLanguage in item ? getStringContent(item[defaultLanguage]) : "",
    [defaultLanguage, item]
  );
  return (
    <div className="py-8 border-b border-divider last:border-b-0 last:pb-0">
      <div className="flex w-full gap-8 font-normal text-left text-small group">
        <div className="flex items-center w-full min-w-0 shrink basis-auto">
          <div className="flex gap-8">
            {editMode && (
              <Checkbox
                disabled={!item.isLocal}
                checked={selectedItems.includes(item)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    dispatch(addSelectedItems([item]));
                  } else {
                    dispatch(removeSelectedItems([item]));
                  }
                }}
              />
            )}
            {itemContentDemo ? (
              <Tooltip content={<>{itemContentDemo}</>}>
                <div className="truncate grow">{itemKey}</div>
              </Tooltip>
            ) : (
              <div className="truncate grow">{itemKey}</div>
            )}
          </div>

          <div className="inline-flex items-center grow-0 shrink-0">
            {item?.duplicated && (
              <Tooltip
                content={
                  <>{`This key has dupplications in other libraries.`}</>
                }
              >
                <DuplicationIcon className="ml-4 text-component">
                  Duplicated
                </DuplicationIcon>
              </Tooltip>
            )}
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
                <ComponentInstanceIcon className="ml-4 text-component" />
              </Tooltip>
            )}
          </div>
        </div>
        {action && (
          <div className="flex gap-12 opacity-0 group-hover:opacity-100 grow-0 shrink-0">
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
