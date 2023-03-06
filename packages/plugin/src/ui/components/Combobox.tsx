import React, { useEffect, useState, ComponentType } from "react";
import { useCombobox } from "downshift";
import classnames from "classnames";
import Menu from "./Menu";
interface ComboboxProps {
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
    content?: string;
    altContent?: string;
    disabled?: boolean;
  }[];
  disabled?: boolean;
  onChange?: Function;
  menuWidth?: string | number;
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
  menuWidth = '100%',
  ...rest
}: ComboboxProps) => {
  const optionToString = (option) => (option ? option.name : "");
  const [items, setItems] = useState(options);
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
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    inputValue
  } = useCombobox({
    items: items,
    itemToString: optionToString,
    selectedItem,
    onInputValueChange({ inputValue }) {
      setItems(
        options.filter(
          (option) =>
            option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.value.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.content && option.content.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.altContent && option.altContent.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    },
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      setSelectedItem(newSelectedItem);
      if (onChange) onChange(newSelectedItem.value);
    },
    onStateChange: (changes) => {
      console.log(changes);
    },
  });
  console.log({ items });
  return (
    <div className={`show-border ${className && className}`}>
      <label htmlFor={id} className="mb-8" {...getLabelProps()}>
        {label}
      </label>
      <div className={`select-menu`}>
        <div
          className={classnames("select-menu__button", {
            "select-menu__button--focus": isFocus,
            "select-menu__button--disabled": disabled,
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
              onFocus: () => {
                // console.log('focus');
                setIsFocus(true);
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

        {isOpen && (
          <Menu
            style={{width: menuWidth}}
            {...getMenuProps()}
          >
            {items.map((item, index) => (
              <Menu.Item
                selected={selectedItem == item}
                highlighted={highlightedIndex == index}
                key={`${item.value}${index}`}
                name={item.name}
                content={item.content}
                {...getItemProps({ item, index, disabled: item.disabled })}
              >
              </Menu.Item>
            ))}
          </Menu>
         )} 
      </div>
    </div>
  );
};

export default Combobox;
