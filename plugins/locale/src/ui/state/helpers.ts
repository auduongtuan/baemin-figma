import { LocaleTextProps, LocaleItem, getParseText } from "../../lib";
import { runCommand } from "../uiHelper";
import { store } from "./store";
import {
  updateTextsInLocaleSelection,
  updateTextInLocaleSelection,
} from "./localeSlice";
import { getFullLocaleText } from "../../lib";
export function updateText(id: string, textProps: LocaleTextProps) {
  const items = store.getState().locale.localeItems;
  const { characters, ...rest } = getFullLocaleText(textProps, items);
  runCommand("update_texts", {
    ids: id,
    // items: textProps.items,
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
  console.log(textProps);
  runCommand("update_texts", {
    ids,
    // items: textProps.items,
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
  // update selected text also
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
      items: localeItems,
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
