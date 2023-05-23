import { LocaleTextProps } from "../lib";
import io from "figma-helpers/io";

export const commands = [
  "select_texts",
  "switch_lang",
  "update_texts",
  "get_locale_data",
  "save_locale_data",
  "print_code_block",
  "show_figma_notify",
  "auto_set_key",
  "create_annotation",
  "set_configs",
] as const;
export type Command = typeof commands[number];

export function runCommand(
  type: "show_figma_notify",
  data: { message: string }
): void;
export function runCommand(type: "update_texts", data: LocaleTextProps): void;
export function runCommand(
  type: Exclude<Command, "update_text">,
  data?: { [key: string]: any }
): void;
export function runCommand(
  type: "set_configs",
  data: { configs: { [key: string]: any } }
): void;
export function runCommand(
  type: string,
  data: { [key: string]: any } = {}
): void {
  io.send(type, data);
}
