import React, { useState, ComponentType } from "react";
import { useEffect } from "react";
import { Fragment } from "react";
// import { Listbox } from "@headlessui/react";
// import * as Select from "@radix-ui/react-select";
import Menu from "./Menu";
import * as Popper from "@radix-ui/react-popper";
import { Portal } from "@radix-ui/react-portal";
import { useSelect } from "downshift";
import classNames from "classnames";
// type ExtractProps<T> = T extends ComponentType<infer P> ? P : T;
export interface SelectOption {
  id?: string;
  value: string;
  name: string;
  disabled?: boolean;
}
export interface SelectProps {
  label?: string;
  id?: string;
  defaultValue?: string;
  value?: string;
  className?: string;
  selectClassName?: string;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
  inline?: boolean;
};
const DownshiftSelect = ({
  label,
  id,
  defaultValue = "",
  value,
  className = "",
  options,
  placeholder = null,
  disabled = false,
  inline = false,
  onChange,
  ...rest
}: SelectProps) => {
  const optionToString = (option) => (option ? option.value : "");
  const [selectedItem, setSelectedItem] = React.useState(null);
  useEffect(() => {
    const newSelectedItem = options.find((option) => option.value == value || option.value == defaultValue);
    if (newSelectedItem) {
      setSelectedItem(newSelectedItem);
    }
    if (!newSelectedItem || !value) {
      setSelectedItem(null);
    }
  }, [value, defaultValue]);
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items: options,
    itemToString: optionToString,
    selectedItem,
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      setSelectedItem(newSelectedItem);
      if (onChange) onChange(newSelectedItem.value);
    },
  });
  return (
    <div
      css={`
        display: ${inline ? 'inline-flex' : 'flex'};
        flex-direction: ${inline ? 'row' : 'column'};
        align-items: ${inline ? 'center' : 'flex-start'};
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
            <button
              className={classNames("select-menu__button", {
                "flex-shrink-1": inline
              })}
              {...getToggleButtonProps()}
              disabled={disabled}
            >
              <span
                className={`select-menu__label ${
                  !selectedItem ? "select-menu__label--placeholder" : ""
                }`}
              >
                {selectedItem ? selectedItem.name : placeholder}
              </span>
              <span className="select-menu__caret"></span>
            </button>
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
                  {options &&
                    options.map((item, index) => (
                      <Menu.Item
                        selected={selectedItem == item}
                        highlighted={highlightedIndex == index}
                        key={`${item.value}${index}`}
                        name={item.name}
                        // content={item.content}
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

export default DownshiftSelect;
