import { GlobeIcon } from "@radix-ui/react-icons";
import { DropdownMenu, DropdownMenuProps, IconButton, Tooltip } from "ds";
import React from "react";
import { LANGUAGE_LIST, Lang, LocaleItem, LocaleText } from "../../../lib";
import { updateText } from "../../state/helpers";
import { useLocaleItems, useLocaleSelection } from "../../hooks/locale";
import { useAppSelector } from "../../hooks/redux";
import configs from "figma-helpers/configs";
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
  const languages = configs.get("languages");
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
        {languages.map((lang) => {
          return (
            <DropdownMenu.Item
              selected={text && text.lang == lang}
              onSelect={() => {
                if (!text) return;
                console.log(lang);
                updateText(text.id, {
                  formula: text.formula || undefined,
                  key: text.key,
                  lang: lang as Lang,
                  item: item,
                  items: items,
                });
              }}
            >
              {LANGUAGE_LIST[lang]}
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
export default SwitchLanguageDropdownMenu;
