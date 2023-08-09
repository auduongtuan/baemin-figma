import React from "react";
import { IconButton, Tooltip, Select, Divider } from "ds";
import { MixerHorizontalIcon, PlusIcon } from "@radix-ui/react-icons";
import {
  setCurrentDialog,
  setEditMode,
  setSource,
} from "../../state/localeAppSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useIsDevMode, useLocaleLibraries } from "../../hooks/locale";
import { getLibraryOptions } from "../../state/helpers";
import { LocaleLibrary } from "../../../lib";
const LocaleItemListHeader = () => {
  const dispatch = useAppDispatch();
  const { source, editMode } = useAppSelector((state) => state.localeApp.list);
  const isDevMode = useIsDevMode();
  return (
    <header className="sticky top-0 z-20 bg-default">
      <div className="flex items-center px-16 py-4">
        <div className="flex w-full gap-8 grow">
          <div className="items-center grow">
            <Select
              inline
              label="Library"
              value={source}
              options={[
                { value: "all", name: "All" },
                ...getLibraryOptions(false),
              ]}
              onChange={(value: string) => {
                dispatch(setSource(value));
              }}
              maxWidth="240px"
            />
          </div>
          {!isDevMode && (
            <div className="inline-flex items-center justify-center gap-8">
              <Tooltip content="Toggle list edit mode">
                <IconButton
                  pressed={editMode}
                  onClick={() => dispatch(setEditMode(!editMode))}
                >
                  <MixerHorizontalIcon />
                </IconButton>
              </Tooltip>
              <Tooltip content="Add new item">
                <IconButton
                  onClick={() => dispatch(setCurrentDialog({ type: "NEW" }))}
                >
                  <PlusIcon />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
      <Divider />
    </header>
  );
};
export default LocaleItemListHeader;
