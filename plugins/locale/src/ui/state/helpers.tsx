import React from "react";
import { LocaleTextProps, LocaleItem, getParseText } from "../../lib";
import { runCommand } from "../uiHelper";
import { store } from "./store";
import {
  updateTextsInLocaleSelection,
  updateTextInLocaleSelection,
} from "./localeSlice";
import { getFullLocaleText, filterItemsByLibrary } from "../../lib";
import { pluralize } from "@capaj/pluralize";
import { FrameIcon, ComponentInstanceIcon } from "@radix-ui/react-icons";
export function updateText(id: string, textProps: LocaleTextProps) {
  const items = store.getState().locale.localeItems;
  const { characters, ...rest } = getFullLocaleText(textProps, items);
  runCommand("update_texts", {
    ids: id,
    ...rest,
  });
  store.dispatch(
    updateTextInLocaleSelection({
      id: id,
      ...rest,
      ...(typeof characters != "undefined" ? { characters } : {}),
    })
  );
}
export function updateTexts(ids: string[], textProps: LocaleTextProps) {
  runCommand("update_texts", {
    ids,
    ...textProps,
  });
  const items = store.getState().locale.localeItems;
  const currentTextsInLocaleSelection =
    store.getState().locale.localeSelection.texts;
  store.dispatch(
    updateTextsInLocaleSelection(
      ids.map((id) => {
        const text = currentTextsInLocaleSelection.find(
          (text) => text.id == id
        );
        const { characters, ...rest } = getFullLocaleText(
          {
            ...text,
            ...textProps,
          },
          items
        );
        return {
          id: id,
          characters,
          ...rest,
        };
      })
    )
  );
}

export function updateTextsOfItem(oldKey: string, item: LocaleItem) {
  // newKey
  const { localeItems, localeSelection } = store.getState().locale;

  const texts = localeSelection.texts.filter(
    (text) =>
      (oldKey && text.key == oldKey) ||
      (!oldKey && text.key == item.key) ||
      (!oldKey && text?.formula && text.formula.includes(":" + item.key + ":"))
  );
  texts.forEach((text) => {
    runCommand("update_texts", {
      ids: text.id,
      ...text,
      item: item,
    });
  });
  store.dispatch(
    updateTextsInLocaleSelection(
      texts.map((text) => {
        const characters =
          getParseText(
            {
              ...text,
              item: item,
              lang: text.lang,
              variables: text.variables,
            },
            localeItems
          ).characters || undefined;
        return {
          ...text,
          key: item.key,
          ...(typeof characters != "undefined" ? { characters } : {}),
        };
      })
    )
  );
}
export function getDefaultLocalLibraryId() {
  const { localeLibraries } = store.getState().locale;
  return localeLibraries.find((library) => library.local)?.id;
}
export function getLibraryName(id: string) {
  const { localeLibraries } = store.getState().locale;
  return localeLibraries.find((library) => library.id == id)?.name;
}
export function getLibraryOptions(local: boolean = true) {
  const { localeLibraries, localeItems } = store.getState().locale;
  return localeLibraries
    .filter((library) => (local && library.local) || !local)
    .map((library) => {
      const itemQuantity = filterItemsByLibrary(localeItems, library).length;
      return {
        name: library.name,
        value: library.id,
        icon: library.local ? <FrameIcon /> : <ComponentInstanceIcon />,
        content: `${itemQuantity} ${pluralize("item", itemQuantity)}`,
      };
    });
}
