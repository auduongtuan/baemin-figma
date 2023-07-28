import { useState } from "react";
import { DashboardIcon } from "@radix-ui/react-icons";
import {
  IconButton,
  Switch,
  Textarea,
  Tooltip,
  DropdownMenu,
  Menu,
  BracketIcon,
} from "ds";
import { get } from "lodash-es";
import { Controller } from "react-hook-form";
import { LANGUAGE_LIST } from "../../../lib";
import { useLanguages } from "@ui/hooks/locale";
import * as Popover from "@radix-ui/react-popover";
import { Portal } from "@radix-ui/react-portal";
function typeInTextarea(newText: string, el = document.activeElement) {
  console.log(el);
  if (el.tagName != "textarea") return;
  const textEl = el as HTMLTextAreaElement;
  const [start, end] = [textEl.selectionStart, textEl.selectionEnd];
  textEl.setRangeText(newText, start, end, "select");
}

const VariableMenu = ({
  open: externalOpen,
  onOpenChange,
  onSelect,
  textareaEl,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (variableName: string) => void;
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
      <Tooltip content="Common variables">
        <Popover.Trigger asChild>
          <IconButton
            className="absolute bottom-9 right-8"
            onMouseDown={(e) => e.preventDefault()}
            // onClick={(e) => {
            //   e.preventDefault();
            //   setOpen(!open);
            //   onOpenChange && onOpenChange(!open);
            // }}
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
            {["{{count}}", "{{formattedCount}}", "{{number}}"].map(
              (variableName) => {
                return (
                  <Menu.Item
                    // selected={text && text.lang == lang}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelect && onSelect(variableName);
                      console.log(onSelect);
                      setOpen(false);
                      onOpenChange && onOpenChange(false);
                    }}
                    name={variableName}
                  />
                );
              }
            )}
          </Menu>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
export default VariableMenu;
