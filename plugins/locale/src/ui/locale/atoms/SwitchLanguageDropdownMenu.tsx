import React from "react";
import { DropdownMenu, IconButton, Tooltip, DropdownMenuProps } from "ds";
import { Lang } from "../../../lib";
import { runCommand } from "../../uiHelper";
import { updateTextInLocaleSelection } from "../../state/localeSlice";
import { GlobeIcon } from "@radix-ui/react-icons";
import { LANGUAGES } from "../../../lib/constant";
import { LocaleText, LocaleItem } from "../../../lib";
import { useAppDispatch } from "../../hooks/redux";
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
  const dispatch = useAppDispatch();
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
