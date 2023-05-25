import { GlobeIcon } from "@radix-ui/react-icons";
import { DropdownMenu, DropdownMenuProps, IconButton, Tooltip } from "ds";
import React from "react";
import { LANGUAGE_LIST, LocaleText } from "../../../lib";
import { updateText } from "../../state/helpers";
import { useLanguages, useLocaleItems } from "../../hooks/locale";
const SwitchLanguageDropdownMenu = ({
  text,
  ...rest
}: DropdownMenuProps & {
  text: LocaleText;
}) => {
  const languages = useLanguages();
  const items = useLocaleItems();
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
                updateText(text.id, {
                  formula: text.formula || undefined,
                  key: text.key,
                  variables: text.variables,
                  lang,
                  items,
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
