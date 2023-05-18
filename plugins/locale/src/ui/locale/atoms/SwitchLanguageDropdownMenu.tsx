import { GlobeIcon } from "@radix-ui/react-icons";
import { DropdownMenu, DropdownMenuProps, IconButton, Tooltip } from "ds";
import React from "react";
import { Lang, LocaleItem, LocaleText } from "../../../lib";
import { LANGUAGES } from "../../../lib/constant";
import { updateText } from "../../state/helpers";
const SwitchLanguageDropdownMenu = ({
  text,
  item,
  items,
  ...rest
}: DropdownMenuProps & {
  text: LocaleText;
  item?: LocaleItem;
  items?: LocaleItem[];
}) => {
  return (
    <DropdownMenu {...rest}>
      <Tooltip content="Switch language">
        <DropdownMenu.Trigger asChild>
          <IconButton>
            <GlobeIcon></GlobeIcon>
          </IconButton>
        </DropdownMenu.Trigger>
      </Tooltip>
      <DropdownMenu.Content>
        {Object.keys(LANGUAGES).map((lang) => {
          return (
            <DropdownMenu.Item
              selected={text && text.lang == lang}
              onSelect={() => {
                if (!text) return;
                updateText(text.id, {
                  formula: text.formula || undefined,
                  lang: lang as Lang,
                  item: item,
                  items: items,
                });
              }}
            >
              {LANGUAGES[lang]}
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
export default SwitchLanguageDropdownMenu;
