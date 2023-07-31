import {
  ComponentInstanceIcon,
  CubeIcon,
  FrameIcon,
} from "@radix-ui/react-icons";
import { Button, IconButton, Popover, Select, Tooltip } from "ds";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Lang,
  LocaleItem,
  LocaleJsonFormat,
  LocaleLibrary,
  isPlurals,
} from "../../../lib";
import {
  useLocaleItems,
  useLocaleLibraries,
  useLocaleSelection,
} from "../../hooks/locale";
import { useAppSelector } from "../../hooks/redux";
import { runCommand } from "../../uiHelper";
import configs from "figma-helpers/configs";
// import Prism from "prismjs";
// import "prismjs/components/prism-json";
// import { Token } from "prismjs";
// import { Token } from "prismjs";
import { pluralize } from "@capaj/pluralize";
import io from "figma-helpers/io";
import { js_beautify } from "js-beautify";
import { set } from "lodash-es";
import { LocaleText } from "../../../lib";
import { compareTimeAsc } from "../../../lib/helpers";
import { filterItemsByLibrary } from "../../../lib";
import { getLibraryOptions } from "../../state/helpers";
import { getLangJSON } from "./exportJson";
const printCodeBlock = (
  localeItems: LocaleItem[],
  library: LocaleLibrary,
  format: LocaleJsonFormat = "i18next",
  scope: "file" | "page" = "file",
  texts: LocaleText[] = null
) => {
  // const tokensObject: {[key:string]: Array<string | Token>} = {};
  const langJSONs: { [key: string]: string } = {};
  let filteredLocaleItems: LocaleItem[];
  if (texts) {
    const keysOfTextsSet = new Set(texts.map((text) => text.key));
    keysOfTextsSet.delete("");
    const keysOfTexts = [...keysOfTextsSet];
    filteredLocaleItems = localeItems.filter((item) =>
      keysOfTexts.includes(item.key)
    );
  } else {
    filteredLocaleItems = localeItems;
  }
  configs.get("languages").forEach((lang) => {
    const langJSON = getLangJSON(
      filterItemsByLibrary(filteredLocaleItems, library),
      lang,
      format
    );
    langJSONs[lang] = langJSON;
    // tokensObject[lang] = Prism.tokenize(
    //   js_beautify(langJSON),
    //   Prism.languages["json"]
    // );
  });

  runCommand("print_code_block", { library, langJSONs, format, scope });
};
const ExportCode = () => {
  const localeItems = useLocaleItems();
  const localeLibraries = useLocaleLibraries();
  const localeSelection = useLocaleSelection();
  const libraryOptions = getLibraryOptions(false);
  const { register, handleSubmit, getValues, control, setValue } = useForm();
  useEffect(() => {
    if (libraryOptions) {
      setValue("libraryId", libraryOptions[0].value);
      setValue("format", "i18n-js");
      if (localeSelection && localeSelection.texts.length > 0) {
        setValue("scope", "selection");
      } else {
        setValue("scope", "file");
      }
    }
  }, [libraryOptions, localeSelection]);

  const [popoverOpen, setPopoverOpen] = useState(false);

  const formSubmit = () => {
    const { libraryId, format, scope } = getValues();
    const library = localeLibraries.find((lib) => lib.id == libraryId);
    if (scope == "file") {
      printCodeBlock(localeItems, library, format, scope);
    }
    if (scope == "selection") {
      printCodeBlock(
        localeItems,
        library,
        format,
        "page",
        localeSelection.texts
      );
    }
    if (scope == "page") {
      io.send("get_texts_in_page");
      io.once("get_texts_in_page", ({ texts }) => {
        printCodeBlock(localeItems, library, format, "page", texts);
      });
    }
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
            name="libraryId"
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid, isTouched, isDirty, error },
              formState,
            }) => (
              <Select
                label={`Library`}
                placeholder="Select library"
                id="libraryId"
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
            name="scope"
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid, isTouched, isDirty, error },
              formState,
            }) => (
              <Select
                label={`Scope`}
                placeholder="Select scope"
                id="scope"
                className="mt-16"
                value={value}
                // key={localeSelection ? localeSelection.id : 'select-lang-no-text'}
                onChange={onChange}
                options={[
                  {
                    name: "File",
                    value: "file",
                    content: "All items in this file",
                  },
                  {
                    name: "Page",
                    value: "page",
                    content: "Items used in current page",
                  },
                  {
                    name: "Selection",
                    value: "selection",
                    content: "Items used in current selection",
                  },
                ]}
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
                    content: "Format used by i18n-js",
                  },
                  {
                    name: "i18next",
                    value: "i18next",
                    content: "Format used by i18next",
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
