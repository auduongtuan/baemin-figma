import { LocaleItem } from "@lib";
import {
  getDefaultLocalLibraryId,
  getLanguages,
  getLibrary,
  isItemDuplicated,
} from "@ui/state/helpers";
import { FormValues } from "./useLocaleForm";
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

const getLocaleItemFromContent = (
  type: "create" | "update" | "quick-update" = "create",
  data: Optional<FormValues, "oldFromLibrary" | "oldKey"> = null,
  localeItem: LocaleItem = null
): LocaleItem => {
  const languages = getLanguages();
  const { key, hasPlurals, prioritized, fromLibrary, ...content } = data;
  const currentDate = new Date();
  const defaultLocalLibraryId = getDefaultLocalLibraryId();
  const duplicated = isItemDuplicated([fromLibrary, key]);
  // console.log("duplicated", duplicated);
  const initalData = {
    ...(localeItem
      ? {
          createdAt: localeItem.createdAt || currentDate.toJSON(),
          prioritized: localeItem.prioritized,
          imported: localeItem.imported,
        }
      : {
          createdAt: currentDate.toJSON(),
        }),
    key: key,
    fromLibrary: fromLibrary || defaultLocalLibraryId,
    isLocal: getLibrary(fromLibrary)?.local || false,
    updatedAt: currentDate.toJSON(),
    ...(type != "quick-update"
      ? { prioritized: prioritized || false, duplicated }
      : {}),
  };
  return languages.reduce((acc, lang: string) => {
    if (lang in hasPlurals && lang in content && content[lang]) {
      acc[lang] = hasPlurals[lang] ? content[lang] : content[lang].one;
    }
    return acc;
  }, initalData);
};

export default getLocaleItemFromContent;
