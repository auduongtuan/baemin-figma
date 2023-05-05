import { LocaleTextProps, findItemByKey, getParsedText } from "../../lib";
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
      characters,
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
        characters,
      }))
    )
  );
}
