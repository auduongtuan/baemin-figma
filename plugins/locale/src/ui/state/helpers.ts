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
  const {
    item: originItem,
    items,
    formula,
    lang,
    variables = {},
    key,
  } = textProps;
  const item = originItem
    ? originItem
    : items && key
    ? findItemByKey(key, items)
    : undefined;
  return {
    key,
    formula,
    items,
    item,
    lang,
    variables,
    characters: textProps.lang
      ? getParsedText({
          formula,
          items,
          item,
          lang,
          variables,
        }).characters
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
      (oldKey && text.key == oldKey) ||
      (!oldKey && text.key == item.key) ||
      (!oldKey && text?.formula && text.formula.includes(":" + item.key + ":"))
  );
  texts.forEach((text) => {
    console.log({
      ids: text.id,
      ...text,
      item: item,
      items: localeItems,
    });
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
          getParsedText({
            ...text,
            item: item,
            lang: text.lang,
            variables: text.variables,
          }).characters || undefined;
        return {
          ...text,
          key: item.key,
          ...(typeof characters != "undefined" ? { characters } : {}),
        };
      })
    )
  );
}
