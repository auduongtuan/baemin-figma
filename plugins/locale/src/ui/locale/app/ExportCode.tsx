import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/redux";
import { useForm, Controller } from "react-hook-form";
import { IconButton, Tooltip, Popover, Select, Button } from "ds";
import {
  ComponentInstanceIcon,
  CubeIcon,
  FrameIcon,
} from "@radix-ui/react-icons";
import { runCommand } from "../../uiHelper";
import { isPlurals, LocaleLibrary, LocaleItem } from "../../../lib";
// import Prism from "prismjs";
// import "prismjs/components/prism-json";
// import { Token } from "prismjs";
import { LANGUAGES } from "../../../constant/locale";
// import { Token } from "prismjs";
import { set } from "lodash";
import { js_beautify } from "js-beautify";
import { pluralize } from "@capaj/pluralize";
import { compareTime } from "../../../lib/helpers";
type JsonFormat = "i18n-js" | "i18next";
const filterItemsByLibrary = (
  localeItems: LocaleItem[],
  library: LocaleLibrary
) => {
  if (!localeItems) return [];
  let filteredLocaleItems: LocaleItem[];
  if (library.local) {
    filteredLocaleItems = localeItems.filter(
      (item) => !("fromLibrary" in item) || !item.fromLibrary
    );
  } else {
    filteredLocaleItems = localeItems.filter(
      (item) => "fromLibrary" in item && item.fromLibrary == library.id
    );
  }
  return filteredLocaleItems;
};
const printCodeBlock = (
  localeItems: LocaleItem[],
  library: LocaleLibrary,
  format: JsonFormat = "i18next"
) => {
  // const tokensObject: {[key:string]: Array<string | Token>} = {};
  const langJSONs: { [key: string]: string } = {};
  console.log("LOCALE ITEMS", localeItems);
  Object.keys(LANGUAGES).forEach((lang) => {
    const langJSON = js_beautify(
      JSON.stringify(
        filterItemsByLibrary(localeItems, library)
          .sort(
            (a, b) =>
              compareTime(a.updatedAt, b.updatedAt) ||
              compareTime(a.createdAt, b.createdAt)
            // cu truoc moi sau
          )
          .reduce((acc, item) => {
            if (isPlurals(item[lang])) {
              if (format == "i18next") {
                Object.keys(item[lang]).forEach((quantity) => {
                  set(acc, `${item.key}_${quantity}`, item[lang][quantity]);
                });
              } else if (format == "i18n-js") {
                Object.keys(item[lang]).forEach((quantity) => {
                  set(acc, `${item.key}.${quantity}`, item[lang][quantity]);
                });
              }
            } else {
              set(acc, item.key, item[lang]);
            }
            return acc;
          }, {})
      ),
      {
        indent_size: 2,
      }
    );
    langJSONs[lang] = langJSON;
    // tokensObject[lang] = Prism.tokenize(
    //   js_beautify(langJSON),
    //   Prism.languages["json"]
    // );
  });

  runCommand("print_code_block", { library, langJSONs });
};
const ExportCode = () => {
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const localeLibraries = useAppSelector(
    (state) => state.locale.localeLibraries
  );

  const libraryOptions =
    localeLibraries &&
    [...localeLibraries].reverse().map((library) => {
      const itemQuantity = filterItemsByLibrary(localeItems, library).length;
      return {
        id: library.id,
        name: library.name,
        value: library,
        icon: library.local ? <FrameIcon /> : <ComponentInstanceIcon />,
        content: `${itemQuantity} ${pluralize("item", itemQuantity)}`,
      };
    });

  const { register, handleSubmit, getValues, control, setValue } = useForm();
  useEffect(() => {
    if (libraryOptions) {
      setValue("library", { ...libraryOptions[0].value });
      setValue("format", "i18n-js");
    }
  }, [libraryOptions]);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const formSubmit = () => {
    const { library, format } = getValues();
    printCodeBlock(localeItems, library, format);
    setPopoverOpen(false);
  };
  return (
    <Popover open={popoverOpen} onOpenChange={(open) => setPopoverOpen(open)}>
      <Tooltip content="Export JSON Code">
        <Popover.Trigger asChild>
          <IconButton>
            <CubeIcon />
          </IconButton>
        </Popover.Trigger>
      </Tooltip>
      <Popover.Content title="Export JSON Code" width={"210px"}>
        <form onSubmit={handleSubmit(formSubmit)}>
          <Controller
            control={control}
            name="library"
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid, isTouched, isDirty, error },
              formState,
            }) => (
              <Select
                label={`Library`}
                placeholder="Select language"
                id="library"
                value={value}
                // key={localeSelection ? localeSelection.id : 'select-lang-no-text'}
                onChange={onChange}
                options={libraryOptions}
                helpText="Large library takes a great amount of time"
                // disabled={localeSelection ? false : true}
              />
            )}
          />
          <Controller
            control={control}
            name="format"
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid, isTouched, isDirty, error },
              formState,
            }) => (
              <Select
                label={`Format`}
                placeholder="Select format"
                id="format"
                className="mt-16"
                value={value}
                // key={localeSelection ? localeSelection.id : 'select-lang-no-text'}
                onChange={onChange}
                options={[
                  {
                    name: "i18n-js",
                    value: "i18n-js",
                    content: "Current format in Swing",
                  },
                  {
                    name: "i18next",
                    value: "i18next",
                    content: "New format might be used",
                  },
                ]}
                // disabled={localeSelection ? false : true}
              />
            )}
          />
          <Button type="submit" className="mt-16">
            Export
          </Button>
        </form>
      </Popover.Content>
    </Popover>
  );
};
export default ExportCode;
