import React from "react";
import { DropdownMenu, IconButton, Tooltip, DropdownMenuProps } from "ds";
import { Lang } from "../../../lib/localeData";
import { runCommand } from "../../uiHelper";
import { updateTextInLocaleSelection } from "../../state/localeSlice";
import { GlobeIcon } from "@radix-ui/react-icons";
import { LANGUAGES } from "../../../constant/locale";
import { LocaleText, LocaleItem } from "../../../lib/localeData";
import { useAppDispatch } from "../../hooks/redux";
const SwitchLanguageDropdownMenu = ({text, item, items, ...rest}: DropdownMenuProps & {text: LocaleText, item?: LocaleItem, items?: LocaleItem[]}) => {
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
                if(!text) return;
                if(text.formula) {
                  runCommand("update_text", {
                    ids: text.id,
                    formula: text.formula,
                    lang: lang as Lang,
                    items: items
                  });
                }
                else {
                  runCommand("update_text", {
                    ids: text.id,
                    lang: lang as Lang,
                    item: item
                  });
                }
                // only need to update lang
                dispatch(updateTextInLocaleSelection({id: text.id, lang: lang}));
              }}
            >
              {LANGUAGES[lang]}
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}
export default SwitchLanguageDropdownMenu;