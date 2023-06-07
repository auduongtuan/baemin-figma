import React from "react";
import { pluralize } from "@capaj/pluralize";
import { IconButton, Tooltip } from "ds";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { TrashIcon } from "@radix-ui/react-icons";
import { setCurrentDialog } from "../../state/localeAppSlice";

const LocaleItemToolbar = ({}) => {
  const listState = useAppSelector((state) => state.localeApp.list);
  const dispatch = useAppDispatch();
  return (
    <div className="py-8 px-16 sticky bottom-0 left-0 w-full bg-white border-t border-divider items-center flex">
      <div className="grow">
        {listState.selectedItems.length}{" "}
        {pluralize("item", listState.selectedItems.length)} selected
      </div>
      <div className="grow-0 shrink-0">
        <Tooltip content="Delete selected items">
          <IconButton
            onClick={() => {
              dispatch(
                setCurrentDialog({
                  type: "DELETE",
                  opened: true,
                  key: "__SELECTED_ITEMS",
                })
              );
            }}
          >
            <TrashIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};
export default LocaleItemToolbar;
