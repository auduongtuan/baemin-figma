import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import Combobox, {
  ComboboxOption,
  ComboboxProps,
} from "../components/Combobox";
import { MIXED_VALUE } from "../../constant/locale";
import { updateLocaleSelection, updateTextInLocaleSelection } from "../state/localeSlice";
import { runCommand } from "../uiHelper";
import { LocaleText, findItemByKey } from "../../lib/localeData";
import { setNewDialogOpened, setNewDialogOnDone, setIsWorking } from "../state/localeAppSlice";
import { LocaleItem } from "../../lib/localeData";
import { isString } from "lodash";
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
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const dispatch = useAppDispatch();
  const localeItemOptions: ComboboxOption[] = [
    ...(localeSelection && localeSelection.summary && localeSelection.summary.key === MIXED_VALUE && forSelection
      ? [
          {
            id: "mixed",
            value: MIXED_VALUE,
            name: "Mixed",
            disabled: true,
          },
        ]
      : []),
    ...(localeItems && localeItems.map((item) => {
      return {
        id: item.key,
        value: item.key,
        name: item.key,
        disabled: false,
        content: item.vi,
        altContent: item.en,
      };
    })),
    ...[
      {
        id: "add_new_item",
        name: "Add new item",
        content: "Cannot find matched item",
        onSelect: () => {
          dispatch(setNewDialogOnDone((localeItem: LocaleItem) => {
            updateSelectionOrText(localeItem);
            // onChangeHandler(localeItem.key);
          }));
          dispatch(setNewDialogOpened(true));
        },
      },
    ],
  ];
  const updateText = (_text: LocaleText, localeItemOrKey: LocaleItem | string) => {
    const localeItem = (isString(localeItemOrKey)) ? findItemByKey(localeItemOrKey, localeItems) : localeItemOrKey;
    runCommand("update_text", {
      id: _text.id,
      localeItem: localeItem,
    });
    dispatch(updateTextInLocaleSelection({..._text, key: localeItem.key, characters: localeItem[_text.lang]}));
    console.log(`Update text ${_text.id} with locale item`, localeItem);
  }
  const updateSelectionOrText = (localeItemOrKey: string | LocaleItem) => {
    // dang selection
    if (forSelection && isString(localeItemOrKey)) {
      dispatch(
        updateLocaleSelection({
          key: localeItemOrKey,
        })
      );
      dispatch(setIsWorking(true));
      updateText(localeSelection, localeItemOrKey);
    }
    // dang text
    else {
      if (text) {
        dispatch(setIsWorking(true));
        updateText(text, localeItemOrKey);
      }
    }
  }
  return (
    <>
    <Combobox
      label={label}
      value={value}
      placeholder="Select key"
      menuWidth={"300px"}
      options={localeItemOptions}
      onChange={updateSelectionOrText}
      disabled={
        forSelection && localeSelection && localeSelection.summary.key == MIXED_VALUE ? true : false
      }
      className="w-half"
      {...rest}
    ></Combobox>
    </>
  );
}
export default KeyCombobox;
