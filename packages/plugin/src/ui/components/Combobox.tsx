import React, { useEffect, useState, ComponentType } from "react";
import { useCombobox } from "downshift";

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
    disabled?: boolean;
  }[];
  disabled?: boolean;
  onChange?: Function;
};
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
  ...rest
}: ComboboxProps) => {
  const optionToString = (option) => (option ? option.name : "");
  const [items, setItems] = useState(options); 
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
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
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: items,
    itemToString: optionToString,
    selectedItem,
    onInputValueChange({inputValue}) {
      setItems(options.filter(option => option.name.toLowerCase().includes(inputValue.toLowerCase()) || option.value.toLowerCase().includes(inputValue.toLowerCase())))
    },
    onSelectedItemChange: ({selectedItem: newSelectedItem}) => {
      setSelectedItem(newSelectedItem);
      if(onChange) onChange(newSelectedItem.value);
    },
    onStateChange: (changes) => {
      console.log(changes);
    }
  });
  console.log({items});
  return (
    <div className={`show-border ${className && className}`}>
      <label htmlFor={id} className="mb-8" {...getLabelProps()}>
        {label}
      </label>
      <div className="select-menu">
        <div className={`select-menu__button ${isFocus ? 'select-menu__button--focus' : ''}`}>
          <input
              className={`select-menu__label ${!selectedItem ? 'select-menu__label--placeholder' : ''} flex-grow-1`}
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
                  setIsFocus(true)
                },
                onBlur: () => {
                  setIsFocus(false)
                }
              })}
            />
          <span className="select-menu__caret" {...getToggleButtonProps({disabled})}></span>
        </div>
        
        {isOpen && (
          <div
            className="select-menu__menu select-menu__menu--active"
            {...getMenuProps()}
          >
        
            {items.map((item, index) => (
              <div
                className={`select-menu__item ${selectedItem == item ? 'select-menu__item--selected' : ''} ${highlightedIndex == index ? 'select-menu__item--highlighted' : ''}`}
                key={`${item.value}${index}`}
                {...getItemProps({ item, index, disabled: item.disabled })}
              >
                <span className="select-menu__item-icon"></span>
                <span className="select-menu__item-label">{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Combobox;
