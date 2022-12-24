import React, { useState, ComponentType } from "react";
import { forwardRef, useEffect } from "react";
import styled from "styled-components";
import { Fragment } from "react";
import { Listbox } from "@headlessui/react";
import * as Select from "@radix-ui/react-select";
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
const HeadlessSelect = ({
  label,
  id,
  defaultValue = "",
  value = "",
  className = "",
  options,
  placeholder = null,
  ...rest
}: SelectProps) => {
  const selectedOption = options.find((option) => option.value == value);
  const [customOpen, setCustomOpen] = useState(false);

  return (
    <div className={`show-border ${className && className}`}>
      <label htmlFor={id} className="mb-8">
        {label}
      </label>

      <Listbox value={value} {...rest}>
        {({ open, ...rest }) => (
          <div className="select-menu">
            <Listbox.Button className="select-menu__button">
              {selectedOption ? (
                <span className="select-menu__label">
                  {selectedOption.name}
                </span>
              ) : (
                <span className="select-menu__label select-menu__label--placeholder">
                  {placeholder ? placeholder : label}
                </span>
              )}
              <span className="select-menu__caret"></span>
            </Listbox.Button>
            {open && (
              <Listbox.Options
                className="select-menu__menu select-menu__menu--active"
                static
              >
                {options.map((option) => {
                  return (
                    <Listbox.Option
                      key={option.id || option.name}
                      value={option.value}
                      disabled={option.disabled}
                      as={Fragment}
                    >
                      {({ active, selected }) => (
                        <li
                          className={`select-menu__item ${
                            selected ? "select-menu__item--selected" : ""
                          }`}
                        >
                          <span className="select-menu__item-icon"></span>
                          <span className="select-menu__item-label">
                            {option.name}
                          </span>
                        </li>
                      )}
                    </Listbox.Option>
                  );
                })}
              </Listbox.Options>
            )}
          </div>
        )}
      </Listbox>
    </div>
  );
};
const RadixSelect = ({
  label,
  id,
  defaultValue = "",
  value,
  className = "",
  options,
  placeholder = null,
  ...rest
}: SelectProps) => {
  const selectedOption = options.find((option) => option.value == value);
  const [customOpen, setCustomOpen] = useState(false);

  // useEffect(() => {
  //   console.log(options);
  // }, [value, options]);
  console.log("Value of select", value);

  return (
    <div className={`show-border ${className && className}`}>
      <label htmlFor={id} className="mb-8">
        {label}
      </label>
      <Select.Root value={value ? value : undefined} {...rest}>
        <div className="select-menu">
          <Select.Trigger className="select-menu__button" aria-label="Select">
            {/* {selectedOption ? (
                <span className="select-menu__label">
                  {selectedOption.name}
                </span>
              ) : (
                <span className="select-menu__label select-menu__label--placeholder">
                  {placeholder ? placeholder : label}
                </span>
              )}
              <span className="select-menu__caret"></span> */}
            <Select.Value
              placeholder={placeholder}
              className="select-menu__label"
            />
            <Select.Icon asChild={true}>
              <span className="select-menu__caret"></span>
            </Select.Icon>
          </Select.Trigger>
          <Select.Content className="select-menu__menu select-menu__menu--active">
            <Select.Viewport className="SelectViewport">
              {options.map((option) => {
                return (
                  <Select.Item
                    className="select-menu__item"
                    value={option.value}
                  >
                    <span className="select-menu__item-icon"></span>
                    <Select.ItemText className="select-menu__item-label">
                      {option.name}
                    </Select.ItemText>
                  </Select.Item>
                );
              })}
            </Select.Viewport>
          </Select.Content>
        </div>
      </Select.Root>
    </div>
  );
};
const DownshiftSelect = ({
  label,
  id,
  defaultValue = "",
  value,
  className = "",
  options,
  placeholder = null,
  onChange,
  ...rest
}: SelectProps) => {
  const optionToString = (option) => (option ? option.value : "");
  const [selectedItem, setSelectedItem] = React.useState(null);
  useEffect(() => {
    const newSelectedItem = options.find(option => option.value == value);
    if(newSelectedItem) {
      setSelectedItem(newSelectedItem);
    }
    if(!newSelectedItem || !value) {
      setSelectedItem(null);
    }
  }, [value])
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
    onSelectedItemChange: ({selectedItem: newSelectedItem}) => {
      setSelectedItem(newSelectedItem);
      if(onChange) onChange(newSelectedItem.value);
    }
  });
  return (
    <div className={`show-border ${className && className}`}>
      <label htmlFor={id} className="mb-8" {...getLabelProps()}>
        {label}
      </label>
      <div className="select-menu">
        <div className="select-menu__button" {...getToggleButtonProps()}>
          <span className={`select-menu__label ${!selectedItem ? 'select-menu__label--placeholder' : ''}`}>
            {selectedItem ? selectedItem.name : placeholder}
          </span>
          <span className="select-menu__caret"></span>
        </div>

        {isOpen && (
          <div
            {...getMenuProps()}
            className="select-menu__menu select-menu__menu--active"
          >
            {options.map((option, index) => (
              <div
                className={`select-menu__item ${selectedItem == option ? 'select-menu__item--selected' : ''} ${highlightedIndex == index ? 'select-menu__item--highlighted' : ''}`}
                key={`${option.value}${index}`}
                {...getItemProps({ item: option, index, disabled: option.disabled })}
              >
                <span className="select-menu__item-icon"></span>
                <span className="select-menu__item-label">{option.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownshiftSelect;
