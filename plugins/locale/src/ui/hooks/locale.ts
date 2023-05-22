import { useAppSelector } from "./redux";

export function useLocaleSelection() {
  return useAppSelector((state) => state.locale.localeSelection);
}
export function useLocaleItems() {
  return useAppSelector((state) => state.locale.localeItems);
}
