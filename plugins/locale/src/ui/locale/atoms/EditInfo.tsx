import React from "react";
import { IconButton, Tooltip } from "ds";
import { defaultDateTimeFormat } from "../../../lib/helpers";
import { LocaleItem } from "../../../lib";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";

const EditInfo = ({ localeItem }: { localeItem: LocaleItem }) => {
  return (
    localeItem &&
    ("createdAt" in localeItem || "updatedAt" in localeItem) && (
      <Tooltip
        content={
          <div className="flex flex-column gap-4">
            {localeItem.createdAt && (
              <div>
                <p className="font-medium">Created at:</p>
                <p className="mt-2">
                  {defaultDateTimeFormat(localeItem.createdAt)}
                </p>
              </div>
            )}
            {localeItem.updatedAt && (
              <div>
                <p className="font-medium">Updated at:</p>
                <p className="mt-2">
                  {defaultDateTimeFormat(localeItem.updatedAt)}
                </p>
              </div>
            )}
          </div>
        }
      >
        <IconButton>
          <CounterClockwiseClockIcon />
        </IconButton>
      </Tooltip>
    )
  );
};
export default EditInfo;
