import { closeCurrentDialog } from "@ui/state/localeAppSlice";
import { useAppDispatch, useAppSelector } from "./redux";

export function useLocaleSelection() {
  return useAppSelector((state) => state.locale.localeSelection);
}
export function useLocaleItems() {
  return useAppSelector((state) => state.locale.localeItems);
}
export function useLocaleLibraries() {
  return useAppSelector((state) => state.locale.localeLibraries);
}
export function useConfigs() {
  return useAppSelector((state) => state.localeApp.configs);
}
export function useLanguages() {
  return useAppSelector((state) => state.localeApp.configs.languages);
}
export function useDialog() {
  return useAppSelector((state) => state.localeApp.currentDialog);
}
export function useDefaultLanguage() {
  return useAppSelector((state) => state.localeApp.configs.defaultLanguage);
}
export function useAltLanguage() {
  return useAppSelector((state) => state.localeApp.configs.altLanguage);
}
