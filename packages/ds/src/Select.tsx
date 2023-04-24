import React, { useState, ComponentType } from "react";
import { useEffect } from "react";
import { Fragment } from "react";
// import { Listbox } from "@headlessui/react";
// import * as Select from "@radix-ui/react-select";
import Menu, { MenuItemProps } from "./Menu";
import * as Popper from "@radix-ui/react-popper";
import { Portal } from "@radix-ui/react-portal";
import { useSelect } from "downshift";
import classNames from "classnames";
import { isEqual } from "lodash";
// type ExtractProps<T> = T extends ComponentType<infer P> ? P : T;
export interface SelectOption extends MenuItemProps {
  id?: string;
  value: any;
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
  onChange: (value: any) => void;
  inline?: boolean;
  errorText?: React.ReactNode;
  helpText?: React.ReactNode;
}
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
  errorText,
  onChange,
  helpText,
  ...rest
}: SelectProps) => {
  const optionToString = (option) => (option ? option.name : "");
  const [selectedItem, setSelectedItem] = React.useState(null);
  useEffect(() => {
    const newSelectedItem = options
      ? options.find(
          (option) =>
            isEqual(option.value, value) ||
            (defaultValue && isEqual(option.value, defaultValue))
        )
      : null;
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
          <button
            type="button"
            className={classNames("select-menu__button", {
              "flex-shrink-1": inline,
            })}
            {...getToggleButtonProps()}
            disabled={disabled}
          >
            <span
              className={`select-menu__label ${
                !selectedItem ? "select-menu__label--placeholder" : ""
              }`}
            >
              {selectedItem ? (
                <span
                  className="flex flex-shrink-1 gap-4 items-center"
                  css={`
                    svg {
                      width: 12px;
                      height: 12px;
                      flex: 0 0 auto;
                    }
                  `}
                >
                  {selectedItem.icon && selectedItem.icon}
                  <span className="flex-shrink-1 truncate">{selectedItem.name}</span>
                </span>
              ) : (
                placeholder
              )}
            </span>
            <span className="select-menu__caret"></span>
          </button>
        </Popper.Anchor>

        {errorText && (
          <p
            css={`
              color: var(--figma-color-text-danger);
              font-size: var(--font-size-xsmall);
            `}
          >
            {errorText}
          </p>
        )}
        {helpText && (
          <p
            css={`
              color: var(--figma-color-text-secondary);
              font-size: var(--font-size-xsmall);
            `}
          >
            {helpText}
          </p>
        )}

        {isOpen && (
          <Portal asChild>
            <Popper.Content
              sideOffset={2}
              align="start"
              collisionPadding={4}
              avoidCollisions={true}
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
                      icon={item.icon}
                      content={item.content}
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
