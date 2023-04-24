import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Menu from "./Menu";

const DropdownMenuItem = ({
  children,
  icon,
  content,
  ...rest
}: DropdownMenu.DropdownMenuItemProps & {icon?: React.ReactNode, content?: React.ReactNode}) => {
  return (
    <DropdownMenu.Item {...rest} asChild>
      <Menu.Item name={children} icon={icon} content={content}></Menu.Item>
    </DropdownMenu.Item>
  );
};
const DropDownMenuContent = ({
  children,
  ...rest
}: DropdownMenu.DropdownMenuContentProps) => {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content sideOffset={2} collisionPadding={4} {...rest} asChild>
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
