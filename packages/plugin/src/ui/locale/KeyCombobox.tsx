import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import Combobox, {
  ComboboxOption,
  ComboboxProps,
} from "../components/Combobox";
import { MIXED_VALUE } from "../../constant/locale";
import { updateLocaleSelection } from "../state/localeSlice";
import { runCommand } from "../uiHelper";
import { LocaleText, findItemByKey } from "../../lib/localeData";
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
  const matchedItem = useAppSelector((state) => state.locale.matchedItem);
  const dispatch = useAppDispatch();
  const localeItemOptions: ComboboxOption[] = [
    ...(localeSelection && localeSelection.key === MIXED_VALUE && forSelection
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
          console.log("add new item");
        },
      },
    ],
  ];
  return (
    <>
    <Combobox
      label={label}
      value={value}
      placeholder="Select key"
      menuWidth={"300px"}
      options={localeItemOptions}
      onChange={(value) => {
        if (forSelection) {
          dispatch(
            updateLocaleSelection({
              key: value,
            })
          );
          const localeItem = findItemByKey(value, localeItems);
          if (localeItem) {
            runCommand("update_text", {
              id: localeSelection.id,
              localeItem: localeItem,
            });
          }
        } else {
          if (text) {
            const localeItem = findItemByKey(value, localeItems);
            if (localeItem) {
              runCommand("update_text", {
                id: text.id,
                localeItem: localeItem,
              });
            }
            console.log("Update text with locale item", localeItem);
          }
        }
      }}
      disabled={
        forSelection && localeSelection && localeSelection.key == MIXED_VALUE ? true : false
      }
      className="w-half"
      {...rest}
    ></Combobox>
    </>
  );
}
export default KeyCombobox;
