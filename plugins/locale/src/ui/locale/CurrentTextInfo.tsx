import React from "react";
import { LANGUAGE_LIST, MIXED_VALUE } from "../../lib/constant";
import {
  useLanguages,
  useLocaleItems,
  useLocaleSelection,
} from "../hooks/locale";
import { runCommand } from "../uiHelper";
import { Select, Divider } from "ds";

import KeyCombobox from "./atoms/KeyCombobox";
import configs from "figma-helpers/configs";

const CurrentTextInfo = () => {
  const localeSelection = useLocaleSelection();
  const localeItems = useLocaleItems();
  const languages = useLanguages();
  console.log(localeSelection.summary);
  return (
    languages &&
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
            value={localeSelection.summary.lang}
            // key={localeSelection ? localeSelection.id : 'select-lang-no-text'}
            onChange={(value) => {
              runCommand("switch_lang", { lang: value, localeItems });
            }}
            options={[
              ...(localeSelection.summary.lang === MIXED_VALUE
                ? [
                    {
                      id: "mixed",
                      value: MIXED_VALUE,
                      name: "Mixed",
                      disabled: true,
                    },
                  ]
                : []),
              ...languages.map((lang) => {
                return {
                  id: lang,
                  value: lang,
                  name: LANGUAGE_LIST[lang],
                  disabled: false,
                };
              }),
            ]}
            disabled={localeSelection ? false : true}
          ></Select>
        </div>
        <Divider />
      </div>
    )
  );
};

export default CurrentTextInfo;
