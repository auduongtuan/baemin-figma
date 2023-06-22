import React from "react";
import { pluralize } from "@capaj/pluralize";
import { IconButton, LibraryIcon, MoveLibraryIcon, Tooltip } from "ds";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { TrashIcon } from "@radix-ui/react-icons";
import { setCurrentDialog } from "../../state/localeAppSlice";
import { Transition } from "@headlessui/react";

const LocaleItemToolbar = ({}) => {
  const listState = useAppSelector((state) => state.localeApp.list);
  const dispatch = useAppDispatch();
  return (
    <Transition
      show={listState.editMode}
      className="transition-[opacity,transform] duration-150 sticky left-0 bottom-8 flex items-center w-calc(100%-16px) px-16 py-8 mx-8 bg-white border rounded-md shadow-sm border-divider"
      enterFrom="translate-y-32 opacity-0"
      enterTo="-translate-y-0 opacity-100"
      leaveFrom="-translate-y-0 opacity-100"
      leaveTo="translate-y-32 opacity-0"
    >
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
    </Transition>
  );
};
export default LocaleItemToolbar;
