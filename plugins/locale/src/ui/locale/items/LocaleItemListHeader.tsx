import React from "react";
import { IconButton, Tooltip, Select, Divider } from "ds";
import { PlusIcon } from "@radix-ui/react-icons";
import { setCurrentDialog } from "../../state/localeAppSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useLocaleLibraries } from "../../hooks/locale";
import { getLibraryOptions } from "../../state/helpers";
import { LocaleLibrary } from "../../../lib";
const LocaleItemListHeader = ({ source, setSource }) => {
  const dispatch = useAppDispatch();
  return (
    <header className="sticky z-20 top-0 bg-white">
      <div className="flex items-center px-16 py-4">
        <div className="flex gap-8 w-full grow">
          <div className="items-center grow">
            <Select
              inline
              label="Library"
              value={source}
              options={[
                { value: "all", name: "All" },
                ...getLibraryOptions(false),
              ]}
              onChange={(value: LocaleLibrary) => {
                setSource(value);
              }}
              maxWidth="240px"
            />
          </div>
          <div className="inline-flex justify-center items-center">
            <Tooltip content="Add new item">
              <IconButton
                onClick={() =>
                  dispatch(setCurrentDialog({ type: "NEW", opened: true }))
                }
              >
                <PlusIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
      <Divider />
    </header>
  );
};
export default LocaleItemListHeader;
