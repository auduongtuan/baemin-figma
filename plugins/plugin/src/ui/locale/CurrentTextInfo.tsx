import React from "react";
import { LANGUAGES, MIXED_VALUE } from "../../constant/locale";
import { useAppSelector } from "../hooks/redux";
import { runCommand } from "../uiHelper";
import { Select, Divider } from "ds";

import KeyCombobox from "./atoms/KeyCombobox";

const CurrentTextInfo = () => {
  const localeSelection = useAppSelector(
    (state) => state.locale.localeSelection
  );
  const localeItems = useAppSelector((state) => state.locale.localeItems);

  return (
    localeSelection && (
      <div
        className=""
        css={`
          position: sticky;
        `}
      >
        {/* <h4 className="mt-0">Summary</h4> */}
        <div className="flex gap-12 px-16 py-4">
          <KeyCombobox
            label="Key"
            inline
            className="w-half"
            value={
              localeSelection && localeSelection.summary
                ? localeSelection.summary.key
                : undefined
            }
            forSelection
          />
          <Select
            label={`Lang`}
            inline
            className="w-half"
            placeholder="Select language"
            id="lang"
            value={
              localeSelection &&
              localeSelection.summary &&
              localeSelection.summary.lang
                ? localeSelection.summary.lang
                : undefined
            }
            // key={localeSelection ? localeSelection.id : 'select-lang-no-text'}
            onChange={(value) => {
              runCommand("switch_lang", { lang: value, localeItems });
            }}
            options={(localeSelection &&
            localeSelection.summary &&
            localeSelection.summary.lang === MIXED_VALUE
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
            disabled={localeSelection ? false : true}
          ></Select>
        </div>
        <Divider />
      </div>
    )
  );
};

export default CurrentTextInfo;
