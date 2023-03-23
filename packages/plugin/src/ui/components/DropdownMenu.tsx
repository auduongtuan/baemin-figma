import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Menu from './Menu';

const DropdownMenuItem = ({children, ...rest}: DropdownMenu.DropdownMenuItemProps) => {
  <DropdownMenu.Item {...rest} asChild>
    <Menu.Item name={children}></Menu.Item>
  </DropdownMenu.Item>
}
const DropDownMenuContent = ({children, ...rest}: DropdownMenu.DropdownMenuContentProps) => {
  <DropdownMenu.Portal>
  <DropdownMenu.Content sideOffset={5} {...rest} asChild>
    <Menu>
      {children}
    </Menu>
  </DropdownMenu.Content>
  </DropdownMenu.Portal>
}

export default Object.assign(DropdownMenu.Root, {Trigger: DropdownMenu.Trigger, Item: DropdownMenuItem, Content: DropDownMenuContent});