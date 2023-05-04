import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Menu, { MenuItemProps } from "./Menu";
export interface DropdownMenuProps extends DropdownMenu.DropdownMenuProps {}
export interface DropdownMenuContentProps
  extends DropdownMenu.DropdownMenuContentProps {}
export interface DropdownMenuItemProps
  extends DropdownMenu.DropdownMenuItemProps, Pick<MenuItemProps, "icon" | "content" | "selected"> {
}
const DropdownMenuItem = ({
  children,
  icon,
  content,
  selected,
  ...rest
}: DropdownMenuItemProps) => {
  return (
    <DropdownMenu.Item {...rest} asChild>
      <Menu.Item name={children} icon={icon} content={content} selected={selected}></Menu.Item>
    </DropdownMenu.Item>
  );
};
const DropDownMenuContent = ({
  children,
  ...rest
}: DropdownMenuContentProps) => {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        sideOffset={2}
        collisionPadding={4}
        {...rest}
        asChild
      >
        <Menu>{children}</Menu>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
};

export default Object.assign(DropdownMenu.Root, {
  Trigger: DropdownMenu.Trigger,
  Item: DropdownMenuItem,
  Content: DropDownMenuContent,
});
