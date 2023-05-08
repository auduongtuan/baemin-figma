import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  UseComboboxState,
  UseComboboxStateChangeOptions,
  useCombobox,
} from "downshift";
import classnames from "classnames";
import Menu from "./Menu";
import * as Popper from "@radix-ui/react-popper";
import { Portal } from "@radix-ui/react-portal";
import debounce from "lodash/debounce";
// import { removeVietnameseAccent } from "../../lib/helpers";
export interface ComboboxOption {
  id?: string;
  value?: string;
  name: string;
  content?: string;
  altContent?: string;
  disabled?: boolean;
  onSelect?: Function;
  icon?: React.ReactNode;
}

export interface ComboboxProps {
  label?: string;
  id?: string;
  defaultValue?: string;
  value?: string;
  className?: string;
  comboboxClassName?: string;
  placeholder?: string;
  options?: ComboboxOption[];
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
const Combobox = ({
  label,
  id,
  defaultValue = "",
  value,
  className = "",
  options,
  placeholder = null,
  disabled = false,
  onChange,
  menuWidth = "100%",
  inline = false,
  ...rest
}: ComboboxProps) => {
  // return <div></div>;
  const itemToString = (item: ComboboxOption) => (item ? item.name : "");
  const [items, setItems] = useState<ComboboxOption[]>(options);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  useEffect(() => {
    const newSelectedItem = options.find((option) => option.value == value);
    if (newSelectedItem) {
      setSelectedItem(newSelectedItem);
    }
    if (!newSelectedItem || !value) {
      setSelectedItem(null);
    }
  }, [value]);
  const stateReducer = useCallback(
    (
      state: UseComboboxState<ComboboxOption>,
      actionAndChanges: UseComboboxStateChangeOptions<ComboboxOption>
    ): UseComboboxState<ComboboxOption> => {
      const { type, changes } = actionAndChanges;
      switch (type) {
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            isOpen: !state.isOpen, // but keep menu open.
            highlightedIndex: state.highlightedIndex, // with the item highlighted.
            selectedItem: changes.selectedItem ?? null,
            inputValue: changes.inputValue ?? "",
            // if we had an item selected.
            ...(changes.selectedItem && {
              // we will show it uppercased.
              inputValue: itemToString(changes.selectedItem),
            }),
          };
        default:
          return {
            ...changes,
            highlightedIndex: changes.highlightedIndex ?? -1,
            selectedItem: changes.selectedItem ?? null,
            inputValue: changes.inputValue ?? "",
            isOpen: changes.isOpen ?? false,
          };
      }
      // return changes;
    },
    []
  );
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
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    inputValue,
  } = useCombobox({
    items: items,
    itemToString: itemToString,
    selectedItem,
    stateReducer,
    onInputValueChange({ inputValue }) {
      onInputValueChangeDebounce(inputValue);
    },
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      if (newSelectedItem) {
        if ("value" in newSelectedItem) {
          setSelectedItem(newSelectedItem);
          if (onChange) onChange(newSelectedItem.value);
        } else {
          if ("onSelect" in newSelectedItem) {
            newSelectedItem.onSelect();
          }
        }
      } else {
        if (onChange) onChange(null);
      }
    },
    // onStateChange: (changes) => {
    //   console.log("Combobox changes", changes);
    // },
  });
  return (
    <div
      css={`
        display: ${inline ? "inline-flex" : "flex"};
        flex-direction: ${inline ? "row" : "column"};
        align-items: ${inline ? "center" : "flex-start"};
        gap: 8px;
      `}
      className={`show-border ${className && className}`}
    >
      {label && (
        <label htmlFor={id} className="text-xsmall" {...getLabelProps()}>
          {label}
        </label>
      )}
      <Popper.Root>
        <Popper.Anchor asChild>
          <div
            className={classnames("select-menu__button", {
              "select-menu__button--focus": isFocus,
              "select-menu__button--disabled": disabled,
              "flex-shrink-1": inline,
            })}
          >
            <input
              className={classnames("select-menu__label flex-grow-1", {
                // "select-menu__label--placeholder": !inputValue ? true : false,
              })}
              placeholder={placeholder}
              css={`
                border: none;
                background: none;
                padding: 0;
                &:focus {
                  border: none;
                  outline: none;
                }
              `}
              {...getInputProps({
                disabled,
                onFocus: (e) => {
                  setIsFocus(true);
                  e.target.select();
                },
                onBlur: () => {
                  setIsFocus(false);
                },
              })}
            />
            <span
              className="select-menu__caret"
              {...getToggleButtonProps({ disabled })}
            ></span>
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
                {...getMenuProps()}
              >
                {items &&
                  items.map((item, index) => (
                    <Menu.Item
                      selected={selectedItem == item}
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
              </Menu>
            </Popper.Content>
          </Portal>
        )}
      </Popper.Root>
    </div>
  );
};

export default Combobox;
