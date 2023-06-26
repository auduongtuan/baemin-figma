import { PlusIcon } from "@radix-ui/react-icons";
import { Combobox, ComboboxOption, ComboboxProps } from "ds";
import { isArray, isString } from "lodash-es";
import React from "react";
import {
  LocaleItem,
  LocaleText,
  findItemByKey,
  getStringContent,
} from "../../../lib";
import { MIXED_VALUE } from "../../../lib/constant";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useLocaleItems } from "../../hooks/locale";
import { updateText, updateTexts } from "../../state/helpers";
import { setCurrentDialog, setIsWorking } from "../../state/localeAppSlice";
import configs from "figma-helpers/configs";
export interface KeyComboboxProps extends ComboboxProps {
  forSelection?: boolean;
  text?: LocaleText;
}

function KeyCombobox({
  label = "Key",
  value,
  text,
  forSelection = false,
  ...rest
}: KeyComboboxProps) {
  const localeSelection = useAppSelector(
    (state) => state.locale.localeSelection
  );
  const localeItems = useLocaleItems();
  const dispatch = useAppDispatch();
  const languages = configs.get("languages", []);
  const defaultLanguage = configs.get("defaultLanguage");
  const altLanguage = languages.find((lang) => lang !== defaultLanguage) || "";
  const localeItemOptions: ComboboxOption[] = [
    ...(localeSelection &&
    localeSelection.summary &&
    localeSelection.summary.key === MIXED_VALUE &&
    forSelection
      ? [
          {
            id: "mixed",
            value: MIXED_VALUE,
            name: "Mixed",
            disabled: true,
          },
        ]
      : []),
    ...(localeItems &&
      localeItems.reduce((acc, item) => {
        if (item?.duplicated) return acc;
        acc.push({
          id: item.key,
          value: item.key,
          name: item.key,
          disabled: false,
          content:
            defaultLanguage in item
              ? getStringContent(item[defaultLanguage])
              : "",
          altContent:
            altLanguage in item ? getStringContent(item[altLanguage]) : "",
        });
        return acc;
      }, [])),
    ...[
      {
        id: "add_new_item",
        name: "Add new item",
        content: "Cannot find matched item",
        onSelect: () => {
          dispatch(
            setCurrentDialog({
              type: "NEW",
              onDone: (localeItem: LocaleItem) => {
                updateSelectionOrText(localeItem);
                // onChangeHandler(localeItem.key);
              },
            })
          );
        },
        icon: <PlusIcon />,
      },
    ],
  ];
  const updateTextCommon = (
    _text: LocaleText | LocaleText[],
    localeItemOrKey: LocaleItem | string
  ) => {
    const localeItem = isString(localeItemOrKey)
      ? findItemByKey(localeItemOrKey, localeItems)
      : localeItemOrKey;
    const textProps = {
      item: localeItem,
      key: localeItem.key,
      // characters: localeItem[text.lang],
    };
    if (isArray(_text)) {
      updateTexts(
        _text.map((text) => text.id),
        textProps
      );
    } else {
      updateText(_text.id, textProps);
    }
  };
  const updateSelectionOrText = (localeItemOrKey: string | LocaleItem) => {
    // dang selection
    if (forSelection && isString(localeItemOrKey)) {
      dispatch(setIsWorking(true));
      updateTextCommon(localeSelection.texts, localeItemOrKey);
    }
    // dang text
    else {
      if (text) {
        dispatch(setIsWorking(true));
        updateTextCommon(text, localeItemOrKey);
      }
    }
  };
  return (
    <Combobox
      label={label}
      value={value}
      placeholder="Select key"
      menuWidth={"300px"}
      options={localeItemOptions}
      onChange={updateSelectionOrText}
      // disabled={
      //   forSelection && localeSelection && localeSelection.summary.key == MIXED_VALUE ? true : false
      // }
      {...rest}
    ></Combobox>
  );
}
export default KeyCombobox;
