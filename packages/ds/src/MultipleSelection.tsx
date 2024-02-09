import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  UseComboboxState,
  UseComboboxStateChangeOptions,
  useCombobox,
  useMultipleSelection,
} from "downshift";
import clsx from "clsx";
import Menu from "./Menu";
import * as Popper from "@radix-ui/react-popper";
import { Portal } from "@radix-ui/react-portal";
import debounce from "lodash-es/debounce";
import { twMerge } from "tailwind-merge";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
// import { removeVietnameseAccent } from "../../lib/helpers";
export interface MultipleSelectionOption {
  id?: string;
  value?: string;
  name: string;
  content?: string;
  altContent?: string;
  disabled?: boolean;
  onSelect?: Function;
  icon?: React.ReactNode;
}

export interface MultipleSelectionProps {
  label?: string;
  id?: string;
  defaultValue?: string[];
  value?: string[];
  className?: string;
  comboboxClassName?: string;
  placeholder?: string;
  options?: MultipleSelectionOption[];
  disabled?: boolean;
  onChange?: Function;
  menuWidth?: string | number;
  inline?: boolean;
}

function smartIncludes(stringA: string, stringB: string) {
  return (
    stringA && stringB && stringA.toLowerCase().includes(stringB.toLowerCase())
  );
  // return stringA && stringB && removeVietnameseAccent(stringA)
  //   .toLowerCase()
  //   .includes(removeVietnameseAccent(stringB).toLowerCase());
}
const MultipleSelection = ({
  label,
  id,
  defaultValue = [],
  value,
  className = "",
  options,
  placeholder = null,
  disabled = false,
  onChange,
  menuWidth = "100%",
  inline = false,
  ...rest
}: MultipleSelectionProps) => {
  // return <div></div>;
  const itemToString = (item: MultipleSelectionOption) =>
    item ? item.name : "";
  const [items, setItems] = useState<MultipleSelectionOption[]>(options);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [inputValue, setInputValue] = React.useState("");

  useEffect(() => {
    setItems(
      inputValue
        ? options.filter(
            (option) =>
              smartIncludes(option.name, inputValue) ||
              smartIncludes(option.value, inputValue)
          )
        : options
    );
  }, [options, inputValue]);

  useEffect(() => {
    const newSelectedItems = options.filter((option) =>
      value.includes(option.value)
    );
    if (newSelectedItems) {
      setSelectedItems(newSelectedItems);
    }
    if (!newSelectedItems || !value || value.length == 0) {
      setSelectedItems([]);
    }
  }, [value]);

  // const onInputValueChange = debounce
  const onInputValueChangeDebounce = useMemo(
    () =>
      debounce((inputValue) => {
        const filteredOptions = options.filter(
          (option) =>
            !option.onSelect &&
            (!inputValue ||
              smartIncludes(option.name, inputValue) ||
              ("value" in option && smartIncludes(option.value, inputValue)) ||
              (option.content && smartIncludes(option.content, inputValue)) ||
              (option.altContent &&
                smartIncludes(option.altContent, inputValue)))
        );
        const suggestions = options.filter((option) => option.onSelect);
        if (filteredOptions && filteredOptions.length > 0) {
          setItems(filteredOptions);
        } else {
          setItems(suggestions);
        }
      }, 150),
    [options]
  );
  useEffect(() => {
    return () => {
      onInputValueChangeDebounce.cancel();
    };
  }, []);
  const { getSelectedItemProps, getDropdownProps, removeSelectedItem } =
    useMultipleSelection({
      selectedItems,
      onStateChange({ selectedItems: newSelectedItems, type }) {
        switch (type) {
          case useMultipleSelection.stateChangeTypes
            .SelectedItemKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
          case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
            setSelectedItems(newSelectedItems);
            break;
          default:
            break;
        }
      },
    });
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: items,
    itemToString: itemToString,
    selectedItem: null,
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // keep the menu open after selection.
            highlightedIndex: items.findIndex(
              (item) => item.value == changes.selectedItem.value
            ), // with the first option highlighted.
          };
        default:
          return changes;
      }
    },
    onStateChange({
      inputValue: newInputValue,
      type,
      selectedItem: newSelectedItem,
    }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (newSelectedItem) {
            const alreadySelected = selectedItems.findIndex(
              (item) => item.value === newSelectedItem.value
            );
            if (alreadySelected < 0) {
              const newSelectedItems = [...selectedItems, newSelectedItem];
              setSelectedItems(newSelectedItems);
              setInputValue("");
              onChange(newSelectedItems.map((item) => item.value));
            } else {
              const newSelectedItems = [
                ...selectedItems.slice(0, alreadySelected),
                ...selectedItems.slice(alreadySelected + 1),
              ];
              setSelectedItems(newSelectedItems);
              onChange(newSelectedItems.map((item) => item.value));
            }
          }
          break;

        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue);

          break;
        default:
          break;
      }
    },
  });
  return (
    <div
      className={twMerge(
        inline ? "inline-flex" : "flex",
        inline ? "flex-row" : "flex-col",
        inline ? "items-center" : "items-start",
        "gap-8 ",
        className
      )}
    >
      {label && (
        <label htmlFor={id} className="text-xsmall" {...getLabelProps()}>
          {label}
        </label>
      )}
      <Popper.Root>
        <Popper.Anchor asChild>
          <div
            className={clsx(
              "select-menu__button",
              {
                "select-menu__button--focus": isFocus,
                "select-menu__button--disabled": disabled,
                shrink: inline,
              },
              "h-auto pl-6 pt-4 pb-4"
            )}
            {...getToggleButtonProps({ disabled })}
          >
            <div className="-mb-2 -mr-2 grow">
              {selectedItems.map((selectedItem, index) => (
                <span className="inline-flex items-center py-1 pl-3 pr-2 mb-2 mr-2 border rounded-sm border-light">
                  <span>{selectedItem.name}</span>
                  <button
                    type="button"
                    className="ml-2"
                    aria-label={`Remove ${selectedItem.name}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeSelectedItem(selectedItem);
                      onChange(
                        selectedItems
                          .filter((item) => item.value !== selectedItem.value)
                          .map((item) => item.value)
                      );
                    }}
                  >
                    <Cross2Icon className="w-10 h-10" />
                  </button>
                </span>
              ))}
            </div>
            <span className="select-menu__caret"></span>
          </div>
        </Popper.Anchor>

        {isOpen && (
          <Portal asChild>
            <Popper.Content
              sideOffset={2}
              align="start"
              collisionPadding={4}
              avoidCollisions={false}
            >
              <Menu
                style={{
                  minWidth: "var(--radix-popper-anchor-width)",
                  maxWidth: "var(--radix-popper-available-width)",
                  maxHeight: "var(--radix-popper-available-height)",
                }}
                className="flex flex-col overflow-hidden"
                {...getMenuProps()}
              >
                <div className="flex items-center gap-4 px-4 mx-6 mb-4 border rounded-sm shrink-0 grow-0 text-onbrandSecondary border-white/20">
                  <MagnifyingGlassIcon className="mr-2 -ml-2 w-14 h-14 grow-0 shrink-0" />
                  <input
                    className={clsx(
                      "block bg-transparent text-xsmall leading-tight p-3 rounded-sm w-full grow border-none bg-none focus:outline-none focus:border-none",
                      {
                        // "select-menu__label--placeholder": !inputValue ? true : false,
                      }
                    )}
                    placeholder={placeholder}
                    // {...getInputProps({
                    //   disabled,
                    //   onFocus: (e) => {
                    //     setIsFocus(true);
                    //     e.target.select();
                    //   },
                    //   onBlur: () => {
                    //     setIsFocus(false);
                    //   },
                    // })}
                    {...getInputProps(
                      getDropdownProps({ preventKeyAction: isOpen })
                    )}
                  />
                </div>
                <div className="h-full overflow-y-scroll grow shrink invisible-scrollbar">
                  {items &&
                    items.map((item, index) => (
                      <Menu.Item
                        selected={selectedItems
                          .map((item) => item.value)
                          .includes(item.value)}
                        highlighted={highlightedIndex == index}
                        key={`${item.value}${index}`}
                        name={item.name}
                        content={item.content}
                        icon={item.icon}
                        {...getItemProps({
                          item,
                          index,
                          disabled: item.disabled,
                        })}
                      ></Menu.Item>
                    ))}
                </div>
              </Menu>
            </Popper.Content>
          </Portal>
        )}
      </Popper.Root>
    </div>
  );
};

export default MultipleSelection;
