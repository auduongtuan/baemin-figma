import {
  LocaleTextProps,
  LocaleItem,
  LocaleSelection,
  findItemByKey,
  getParsedText,
} from "../../lib";
import { runCommand } from "../uiHelper";
import { store } from "./store";
import {
  updateTextsInLocaleSelection,
  updateTextInLocaleSelection,
} from "./localeSlice";
function handleTextPropsForSlice(textProps: LocaleTextProps) {
  const { item: originItem, items, ...rest } = textProps;
  const item = originItem
    ? originItem
    : items && textProps.key
    ? findItemByKey(textProps.key, items)
    : undefined;
  return {
    ...rest,
    item,
    items,
    characters: textProps.lang
      ? getParsedText(textProps, textProps.lang, textProps.variables || {})
          .characters
      : undefined,
  };
}
export function updateText(id: string, textProps: LocaleTextProps) {
  const { item, items, characters, ...rest } =
    handleTextPropsForSlice(textProps);
  runCommand("update_texts", {
    ids: id,
    item,
    items,
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
  const { item, items, characters, ...rest } =
    handleTextPropsForSlice(textProps);
  runCommand("update_texts", {
    ids,
    item,
    items,
    ...rest,
  });
  store.dispatch(
    updateTextsInLocaleSelection(
      ids.map((id) => ({
        id: id,
        ...rest,
        ...(typeof characters != "undefined" ? { characters } : {}),
      }))
    )
  );
}

export function updateTextsOfItem(
  oldKey: string,
  item: LocaleItem,
  localeSelection: LocaleSelection,
  localeItems?: LocaleItem[]
) {
  // newKey
  // update selected text also
  const texts = localeSelection.texts.filter(
    (text) =>
      (oldKey && text.key == oldKey) || (!oldKey && text.key == item.key)
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
          getParsedText({ ...text, item: item }, text.lang, text.variables)
            .characters || undefined;
        return {
          ...text,
          key: item.key,
          ...(typeof characters != "undefined" ? { characters } : {}),
        };
      })
    )
  );
}
