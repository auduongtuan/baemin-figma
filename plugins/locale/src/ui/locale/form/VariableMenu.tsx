import { useState } from "react";
import { IconButton, Tooltip, Menu, BracketIcon } from "ds";
import { COMMON_VARIABLE_NAMES } from "../../../lib";
import * as Popover from "@radix-ui/react-popover";

const VariableMenu = ({
  open: externalOpen,
  onOpenChange,
  onSelect,
  textareaEl,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (variableName: string, textareaEl: HTMLTextAreaElement) => void;
  textareaEl?: HTMLTextAreaElement;
}) => {
  const [internalOpen, setOpen] = useState(false);
  const open = externalOpen ?? internalOpen;
  return (
    <Popover.Root
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        onOpenChange && onOpenChange(open);
      }}
    >
      <Tooltip content="Add common variable">
        <Popover.Trigger asChild>
          <IconButton
            className={`bg-default absolute bottom-9 right-8 opacity-0 group-hover:opacity-100 aria-expanded:opacity-100 transition-opacity duration-100`}
            onMouseDown={(e) => e.preventDefault()}
          >
            <BracketIcon />
          </IconButton>
        </Popover.Trigger>
      </Tooltip>
      <Popover.Portal>
        <Popover.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <Menu
            style={{
              minWidth: "var(--radix-popover-anchor-width)",
              maxWidth: "var(--radix-popover-available-width)",
              maxHeight: "var(--radix-popover-available-height)",
            }}
          >
            {COMMON_VARIABLE_NAMES.map((variableName) => {
              return (
                <Menu.Item
                  // selected={text && text.lang == lang}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelect && onSelect(variableName, textareaEl);
                    setOpen(false);
                    onOpenChange && onOpenChange(false);
                  }}
                  name={variableName}
                />
              );
            })}
          </Menu>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
export default VariableMenu;
