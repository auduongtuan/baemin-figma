import { pluralize } from "@capaj/pluralize";
import { FolderIcon, IconButton, MoveLibraryIcon, Tooltip } from "ds";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Cross2Icon, StackIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  clearSelectedItems,
  setCurrentDialog,
} from "../../state/localeAppSlice";
import { Transition } from "@headlessui/react";

const LocaleItemToolbar = ({}) => {
  const listState = useAppSelector((state) => state.localeApp.list);
  const dispatch = useAppDispatch();
  return (
    <div className="sticky bottom-0 left-0 flex flex-col justify-end h-0">
      <Transition
        show={listState.editMode}
        className="shrink-0 transition-[opacity,transform] duration-150 pb-8"
        enterFrom="translate-y-32 opacity-0"
        enterTo="-translate-y-0 opacity-100"
        leaveFrom="-translate-y-0 opacity-100"
        leaveTo="translate-y-32 opacity-0"
      >
        <div className="flex items-center w-calc(100%-16px) px-16 py-8 pb-8 mx-8 bg-default border rounded-md shadow-sm border-divider">
          <div className="flex items-center grow ">
            {listState.selectedItems.length}{" "}
            {pluralize("item", listState.selectedItems.length)} selected
            {listState.selectedItems.length > 0 && (
              <Tooltip content="Clear selection">
                <IconButton
                  className="ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(clearSelectedItems());
                  }}
                >
                  <Cross2Icon></Cross2Icon>
                </IconButton>
              </Tooltip>
            )}
          </div>
          <div className="flex gap-16 grow-0 shrink-0">
            {listState.selectedItems.length > 0 && (
              <>
                <Tooltip content="Move items to other group">
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(
                        setCurrentDialog({
                          type: "MOVE_GROUP",
                          key: "__SELECTED_ITEMS",
                        })
                      );
                    }}
                  >
                    <FolderIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip content="Move items to other library">
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(
                        setCurrentDialog({
                          type: "MOVE_LIBRARY",
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
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(
                        setCurrentDialog({
                          type: "DELETE",
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
      </Transition>
    </div>
  );
};
export default LocaleItemToolbar;
