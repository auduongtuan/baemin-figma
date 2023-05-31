import { useEffect } from "react";
import { useAppSelector } from "../../hooks/redux";
import {
  useLanguages,
  useLocaleItems,
  useLocaleSelection,
} from "../../hooks/locale";
import { useForm } from "react-hook-form";
import { Lang, LocaleItem } from "../../../lib";
import { isPlurals } from "../../../lib/localeItem";
import { removeVietnameseAccent } from "../../../lib/helpers";
import { snakeCase } from "lodash-es";
import { getDefaultLocalLibraryId } from "../../state/helpers";
function useLocaleForm({
  item,
  quickEdit,
}: {
  item: LocaleItem;
  quickEdit?: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  const watchHasPlurals = watch("hasPlurals", { en: false, vi: false });
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
        // language
        else if (languages.includes(inputName as Lang)) {
          const itemContent = item[inputName];
          if (isPlurals(itemContent)) {
            setValue(`hasPlurals.${inputName}`, true);
            setValue(`${inputName}.one`, itemContent.one);
            setValue(`${inputName}.other`, itemContent.other);
          } else {
            setValue(`hasPlurals.${inputName}`, false);
            setValue(`${inputName}.one`, itemContent);
          }
        } else if (inputName == "prioritized") {
          setValue(inputName, item[inputName]);
        }
      }
    } else {
      reset({
        oldKey: "",
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
  }, [item]);
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
  }, [localeSelection]);

  return {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
    setValue,
    getValues,
    watchHasPlurals,
    isEdit,
  };
}

export default useLocaleForm;
