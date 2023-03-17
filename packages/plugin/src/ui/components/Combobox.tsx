import React, { useEffect, useState, ComponentType } from "react";
import { useCombobox } from "downshift";
import classnames from "classnames";
import Menu from "./Menu";

export interface ComboboxOption {
  id?: string;
  value?: string;
  name: string;
  content?: string;
  altContent?: string;
  disabled?: boolean;
  onSelect?: Function;
}

export interface ComboboxProps {
  label?: string;
  id?: string;
  defaultValue?: string;
  value?: string;
  className?: string;
  placeholder?: string;
  options?: ComboboxOption[];
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
  // return <div></div>;
  const itemToString = (item) => (item ? item.name : "");
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
    itemToString: itemToString,
    selectedItem,
    onInputValueChange({ inputValue }) {
      const filteredOptions = options.filter(
        (option) =>
          !option.onSelect && (
            !inputValue ||
            option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            'value' in option && option.value.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.content && option.content.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.altContent && option.altContent.toLowerCase().includes(inputValue.toLowerCase())
          )
      );
      const suggestions = options.filter(option => option.onSelect);
      if(filteredOptions && filteredOptions.length > 0) {
        setItems(filteredOptions);
      } else {
        setItems(suggestions);
      }
    },
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      if(newSelectedItem) {
        if('value' in newSelectedItem) {
          setSelectedItem(newSelectedItem);
          if (onChange) onChange(newSelectedItem.value);
        } else {
          if('onSelect' in newSelectedItem) {
            newSelectedItem.onSelect();
          }
        }
      } 

    },
    onStateChange: (changes) => {
    },
  });
  return (
    <div className={`show-border ${className && className}`}>
      {label && <label htmlFor={id} className="mb-8" {...getLabelProps()}>
        {label}
      </label>}
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
            {items && items.map((item, index) => (
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
