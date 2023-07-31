import { useEffect } from "react";
import { useLanguages, useLocaleSelection } from "../../hooks/locale";
import { useForm, useWatch } from "react-hook-form";
import { Lang, LocaleItem } from "../../../lib";
import { isPlurals } from "../../../lib/localeItem";
import { removeVietnameseAccent } from "../../../lib/helpers";
import { snakeCase } from "lodash-es";
import { getDefaultLocalLibraryId, getLanguages } from "../../state/helpers";

type LangContent = Partial<
  Record<
    Lang,
    {
      one?: string;
      other?: string;
    }
  >
>;
export type FormValues = LangContent & {
  fromLibrary: string;
  key: string;
  hasPlurals: { [key in Lang]?: boolean };
  prioritized: boolean;
  oldKey: string;
  oldFromLibrary: string;
};

function useLocaleForm({ item }: { item: LocaleItem }) {
  const methods = useForm<FormValues>();
  const { control, reset, setValue } = methods;
  const watchHasPlurals = useWatch({
    control,
    name: "hasPlurals",
    defaultValue: getLanguages().reduce(
      (acc, lang) => ({ ...acc, [lang]: false }),
      {}
    ),
  });
  const isEdit = item ? true : false;
  const localeSelection = useLocaleSelection();
  const languages = useLanguages();
  // setup values for edit form
  useEffect(() => {
    if (item && item.key) {
      for (const inputName in item) {
        if (inputName == "key") {
          setValue("oldKey", item.key);
          setValue("key", item.key);
        }
        if (inputName == "fromLibrary") {
          setValue("oldFromLibrary", item.fromLibrary);
          setValue("fromLibrary", item.fromLibrary);
        }
        if (inputName == "prioritized") {
          setValue(inputName, item[inputName]);
        }
        // language
        if (languages.includes(inputName as Lang)) {
          const lang = inputName as Lang;
          const itemContent = item[inputName];
          if (isPlurals(itemContent)) {
            setValue(`hasPlurals.${lang}`, true);
            setValue(`${lang}.one`, itemContent.one);
            setValue(`${lang}.other`, itemContent.other);
          } else {
            setValue(`hasPlurals.${lang}`, false);
            setValue(`${lang}.one`, itemContent);
          }
        }
      }
    } else {
      reset({
        oldKey: "",
        oldFromLibrary: "",
        key: "",
        ...languages.reduce((acc, lang) => {
          acc[lang] = null;
          return acc;
        }, {}),
        hasPlurals: { en: false, vi: false },
        prioritized: undefined,
        fromLibrary: getDefaultLocalLibraryId(),
      });
    }
  }, []);
  // setup values for new form
  useEffect(() => {
    if (!item && localeSelection && localeSelection.texts[0]) {
      if (!localeSelection.texts[0].key) {
        const newKey = snakeCase(
          removeVietnameseAccent(localeSelection.texts[0].characters)
        );
        setValue("key", newKey);
        languages.forEach((lang) => {
          setValue(`${lang}.one`, localeSelection.texts[0].characters);
        });
      }
    }
    if (!localeSelection) {
      languages.forEach((lang) => {
        setValue(`${lang}.one`, "");
      });
    }
  }, []);

  return {
    methods,
    watchHasPlurals,
    isEdit,
  };
}

export default useLocaleForm;
