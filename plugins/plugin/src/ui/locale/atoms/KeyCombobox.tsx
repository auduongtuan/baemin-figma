import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Combobox, ComboboxOption, ComboboxProps } from "ds";
import { MIXED_VALUE } from "../../../constant/locale";
import {
  updateTextInLocaleSelection,
  updateTextsInLocaleSelection,
} from "../../state/localeSlice";
import { runCommand } from "../../uiHelper";
import {
  LocaleItemContent,
  LocaleText,
  findItemByKey,
  isPlurals,
} from "../../../lib/localeData";
import { setCurrentDialog, setIsWorking } from "../../state/localeAppSlice";
import { LocaleItem } from "../../../lib/localeData";
import { isArray, isString } from "lodash";
import { PlusIcon } from "@radix-ui/react-icons";
export interface KeyComboboxProps extends ComboboxProps {
  forSelection?: boolean;
  text?: LocaleText;
}
function getStringContent(content: LocaleItemContent): string {
  if (isPlurals(content)) {
    return content.other || content.one;
  } else {
    return content;
  }
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
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const dispatch = useAppDispatch();
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
      localeItems.map((item) => {
        return {
          id: item.key,
          value: item.key,
          name: item.key,
          disabled: false,
          content: getStringContent(item.vi),
          altContent: getStringContent(item.en),
        };
      })),
    ...[
      {
        id: "add_new_item",
        name: "Add new item",
        content: "Cannot find matched item",
        onSelect: () => {
          dispatch(
            setCurrentDialog({
              opened: true,
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
  const updateText = (
    _text: LocaleText | LocaleText[],
    localeItemOrKey: LocaleItem | string
  ) => {
    const localeItem = isString(localeItemOrKey)
      ? findItemByKey(localeItemOrKey, localeItems)
      : localeItemOrKey;
    if (isArray(_text)) {
      runCommand("update_text", {
        ids: _text.map((text) => text.id),
        item: localeItem,
      });
      dispatch(
        updateTextsInLocaleSelection(
          _text.map((text) => ({
            ...text,
            key: localeItem.key,
            characters: localeItem[text.lang],
          }))
        )
      );
    } else {
      runCommand("update_text", {
        ids: _text.id,
        item: localeItem,
      });
      dispatch(
        updateTextInLocaleSelection({
          ..._text,
          key: localeItem.key,
          characters: localeItem[_text.lang],
        })
      );
      console.log(`Update text ${_text.id} with locale item`, localeItem);
    }
  };
  const updateSelectionOrText = (localeItemOrKey: string | LocaleItem) => {
    // dang selection
    if (forSelection && isString(localeItemOrKey)) {
      dispatch(setIsWorking(true));
      console.log("update for selection");
      updateText(localeSelection.texts, localeItemOrKey);
    }
    // dang text
    else {
      if (text) {
        dispatch(setIsWorking(true));
        updateText(text, localeItemOrKey);
      }
    }
  };
  return (
    <>
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
    </>
  );
}
export default KeyCombobox;
