import React, { useEffect, useMemo } from "react";
import * as Popper from "@radix-ui/react-popper";
import { Portal } from "@radix-ui/react-portal";
import clsx from "clsx";
import { UseSelectProps, useSelect } from "downshift";
import { isEqual } from "lodash-es";
import Menu, { MenuItemProps } from "./Menu";
import { DismissableLayer } from "@radix-ui/react-dismissable-layer";
import { useDialogContext } from "./Dialog";
import { twMerge } from "tailwind-merge";
export interface SelectOption extends MenuItemProps {
  id?: string;
  value: any;
  name: string;
  content?: string;
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
  options?: SelectOption[];
  disabled?: boolean;
  onChange?: (value: any) => void;
  inline?: boolean;
  errorText?: React.ReactNode;
  helpText?: React.ReactNode;
  maxWidth?: number | string;
  labelComponent?: React.ComponentType<any>;
  contentTruncate?: boolean;
}
const Select = ({
  label,
  labelComponent: LabelComponent,
  id,
  defaultValue = "",
  value,
  className = "",
  options = [],
  placeholder = null,
  disabled = false,
  inline = false,
  errorText,
  onChange,
  helpText,
  maxWidth,
  contentTruncate,
  ...rest
}: SelectProps) => {
  const optionToString = (option: SelectOption) => (option ? option.name : "");
  const [selectedItem, setSelectedItem] = React.useState(null);
  useEffect(() => {
    const newSelectedItem = options.find(
      (option) =>
        isEqual(option.value, value) || isEqual(option.value, defaultValue)
    );
    if (newSelectedItem) {
      setSelectedItem(newSelectedItem);
    }
    if (!newSelectedItem || !value) {
      setSelectedItem(null);
    }
  }, [options, value, defaultValue]);
  const stateReducer: UseSelectProps<any>["stateReducer"] = (
    state,
    actionAndChanges
  ) => {
    const { type, changes } = actionAndChanges;
    switch (type) {
      // disable downshift clickoutside
      case useSelect.stateChangeTypes.ToggleButtonBlur:
        return {
          ...changes,
          isOpen: isOpen,
        };
      case useSelect.stateChangeTypes.ToggleButtonKeyDownEscape:
        return changes;
      default:
        return changes;
    }
    // return changes;
  };
  const { setContextValue } = useDialogContext();

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
    closeMenu,
  } = useSelect({
    items: options,
    itemToString: optionToString,
    selectedItem,
    stateReducer,
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      setSelectedItem(newSelectedItem);
      if (onChange) onChange(newSelectedItem.value);
    },
  });
  useEffect(() => {
    if (setContextValue) {
      if (isOpen) {
        setContextValue({ holdEscape: isOpen });
      } else {
        setTimeout(() => {
          setContextValue({ holdEscape: false });
        });
      }
    }
  }, [setContextValue, isOpen]);
  const labelRender = useMemo(
    () => (
      <label htmlFor={id} className="text-xsmall" {...getLabelProps()}>
        {label}
      </label>
    ),
    [label]
  );

  return (
    <div
      className={twMerge(
        `gap-8`,
        inline
          ? "inline-flex flex-row items-center"
          : "flex flex-col items-start",
        className
      )}
    >
      {label &&
        (LabelComponent ? (
          <LabelComponent>{labelRender}</LabelComponent>
        ) : (
          labelRender
        ))}
      <Popper.Root>
        <Popper.Anchor asChild>
          <button
            type="button"
            className={clsx("select-menu__button", {
              shrink: inline,
            })}
            {...getToggleButtonProps()}
            disabled={disabled}
            style={{
              maxWidth: maxWidth,
            }}
          >
            <span
              className={twMerge(
                `select-menu__label`,
                !selectedItem ? "select-menu__label--placeholder" : ""
              )}
            >
              {selectedItem ? (
                <span className="flex items-center gap-4 shrink [&_svg]:w-12 [&_svg]:h-12 [&_svg]:flex-[0_0_auto]">
                  {selectedItem.icon && selectedItem.icon}
                  <span className="truncate shrink">{selectedItem.name}</span>
                </span>
              ) : (
                placeholder
              )}
            </span>
            <span className="select-menu__caret"></span>
          </button>
        </Popper.Anchor>

        {errorText && <p className="text-danger text-xsmall">{errorText}</p>}
        {helpText && <p className="text-secondary text-xsmall">{helpText}</p>}

        {isOpen && (
          <Portal asChild>
            <DismissableLayer
              style={{
                pointerEvents: "auto",
              }}
              onPointerDownOutside={(e) => {
                closeMenu();
              }}
            >
              <Popper.Content
                sideOffset={2}
                align="start"
                collisionPadding={4}
                avoidCollisions={true}
                style={{ zIndex: 80 }}
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
                        contentTruncate={contentTruncate}
                        {...getItemProps({
                          item,
                          index,
                          disabled: item.disabled,
                        })}
                      ></Menu.Item>
                    ))}
                </Menu>
              </Popper.Content>
            </DismissableLayer>
          </Portal>
        )}
      </Popper.Root>
    </div>
  );
};

export default Select;
