import React from "react";
import { pluralize } from "@capaj/pluralize";
import { IconButton, LibraryIcon, MoveLibraryIcon, Tooltip } from "ds";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { TrashIcon } from "@radix-ui/react-icons";
import { setCurrentDialog } from "../../state/localeAppSlice";

const LocaleItemToolbar = ({}) => {
  const listState = useAppSelector((state) => state.localeApp.list);
  const dispatch = useAppDispatch();
  return (
    <div className="sticky bottom-0 left-0 flex items-center w-full px-16 py-8 bg-white border-t border-divider">
      <div className="grow">
        {listState.selectedItems.length}{" "}
        {pluralize("item", listState.selectedItems.length)} selected
      </div>
      <div className="flex gap-16 grow-0 shrink-0">
        {listState.selectedItems.length > 0 && (
          <>
            <Tooltip content="Move items to other library">
              <IconButton
                onClick={() => {
                  console.log("test");
                  dispatch(
                    setCurrentDialog({
                      type: "MOVE_LIBRARY",
                      opened: true,
                      key: "__SELECTED_ITEMS",
                    })
                  );
                }}
              >
                <MoveLibraryIcon />
              </IconButton>
            </Tooltip>
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
          </>
        )}
      </div>
    </div>
  );
};
export default LocaleItemToolbar;
