import React from "react";
import { LANGUAGES, MIXED_VALUE } from "../../constant/locale";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { runCommand } from "../uiHelper";
import Select from "../components/Select";
import Combobox from "../components/Combobox";
import Button from "../components/Button";

import {
  updateLocaleSelection
} from "../state/localeSlice";
import KeyCombobox from "./KeyCombobox";

const CurrentTextInfo = () => {
  const matchedItem = useAppSelector((state) => state.locale.matchedItem);
  const localeSelection = useAppSelector((state) => state.locale.localeSelection);
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const dispatch = useAppDispatch();
  const assignKey = () => {
    runCommand(
      "update_text", {
      id: localeSelection.id,
      key: matchedItem.key,
      localeItem: localeItems[matchedItem.key],
    });
  };
  // console.log({ localeSelection });

  // console.log("Re-render Current Text Info");
  return (
    localeSelection && (
      <div
        className="p-16"
        css={`
          border-bottom: 1px solid #eee;
        `}
      >
        <h4 className="mt-0">Current selection</h4>
        <div className="flex gap-12 mt-16">
          <KeyCombobox value={localeSelection ? localeSelection.key : undefined} forSelection />
          <Select
            label={`Language`}
            placeholder="Select language"
            id="lang"
            value={
              localeSelection && localeSelection.lang ? localeSelection.lang : undefined
            }
            // key={localeSelection ? localeSelection.id : 'select-lang-no-text'}
            onChange={(value) => {
              runCommand("switch_lang", {lang: value, localeItems });
            }}
            options={(localeSelection && localeSelection.lang === MIXED_VALUE
              ? [
                  {
                    id: "mixed",
                    value: MIXED_VALUE,
                    name: "Mixed",
                    disabled: true,
                  },
                ]
              : []
            ).concat(
              Object.keys(LANGUAGES).map((lang) => {
                return {
                  id: lang,
                  value: lang,
                  name: LANGUAGES[lang],
                  disabled: false,
                };
              })
            )}
            className="w-half"
            disabled={localeSelection ? false : true}
          ></Select>
        </div>
        {localeSelection && !localeSelection.multiple && !localeSelection.key ? (
          <div>
            {matchedItem && (
              <div className="mt-16">
                <p>
                  Assign key{" "}
                  <strong className="font-medium">{matchedItem.key}</strong> to
                  this text.
                </p>
                <Button
                  // variant="secondary"
                  className="mt-8"
                  onClick={assignKey}
                >
                  Assign key
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    )
  );
};

export default CurrentTextInfo;
