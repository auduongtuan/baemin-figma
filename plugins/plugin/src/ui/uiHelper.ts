import { LocaleText } from "../lib/localeData";

export const postData = (data: { [key: string]: any }) => {
  parent.postMessage({ pluginMessage: data }, "*");
};
export const commands = [
  "select_texts",
  "switch_lang",
  "update_text",
  "get_locale_data",
  "save_locale_data",
  "export_code",
  "show_figma_notify",
  "auto_set_key",
  "create_annotation"
] as const;
export type Command = typeof commands[number];

export function runCommand(type: "show_figma_notify", data: {message: string}): void;
export function runCommand(type: "update_text", data: Omit<LocaleText, "id"> & {
  ids: string | string[]
}): void;
export function runCommand(type: Exclude<Command, "update_text">, data?: { [key: string]: any }): void;

export function runCommand(type: string, data: { [key: string]: any } = {}): void {
  parent.postMessage({ pluginMessage: {
    type: type,
    ...data
  } }, "*");
}
