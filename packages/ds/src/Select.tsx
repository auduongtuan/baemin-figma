import React, { useState, ComponentType } from "react";
import { useEffect } from "react";
import { Fragment } from "react";
import { Listbox } from "@headlessui/react";
import * as Select from "@radix-ui/react-select";
import Menu from "./Menu";
import * as Popper from "@radix-ui/react-popper";
import { Portal } from "@radix-ui/react-portal";
import { useSelect } from "downshift";
type ExtractProps<T> = T extends ComponentType<infer P> ? P : T;

type SelectProps = ExtractProps<typeof Listbox> & {
  label?: string;
  id?: string;
  defaultValue?: string;
  value?: string;
  className?: string;
  placeholder?: string;
  options: {
    id?: string;
    value: string;
    name: string;
    disabled?: boolean;
  }[];
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
  onChange,
  ...rest
}: SelectProps) => {
  const optionToString = (option) => (option ? option.value : "");
  const [selectedItem, setSelectedItem] = React.useState(null);
  useEffect(() => {
    const newSelectedItem = options.find((option) => option.value == value);
    if (newSelectedItem) {
      setSelectedItem(newSelectedItem);
    }
    if (!newSelectedItem || !value) {
      setSelectedItem(null);
    }
  }, [value]);
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
    <div className={`show-border ${className && className}`}>
      {label && <label htmlFor={id} className="mb-8 text-xsmall" {...getLabelProps()}>
        {label}
      </label>}
      <Popper.Root>
      <div>
        <Popper.Anchor asChild>
        <button
          className="select-menu__button"
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
      </div>
      </Popper.Root>
    </div>
  );
};

export default DownshiftSelect;
